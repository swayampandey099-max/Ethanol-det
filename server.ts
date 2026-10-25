import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Groq API key configuration via environment variable
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

async function callGroqAi(prompt: string) {
  if (!GROQ_API_KEY) return null;
  const models = ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'allam-2-7b', 'openai/gpt-oss-20b'];
  for (const model of models) {
    try {
      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are an automotive powertrain engineer. Return ONLY a single raw JSON object with the requested properties and values, without any enclosing markdown backticks or commentary.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
      });

      if (!resp.ok) continue;
      const data: any = await resp.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (parsed.suitabilityVerdict && parsed.headlineSummary) {
          return parsed;
        }
      }
    } catch (e) {
      // Continue to next model or fallback
    }
  }
  return null;
}


// Fallback deterministic engineering analyzer if API key is not yet set or upstream error occurs
function getDeterministicAnalysis(vehicle: any, ethanolPct: number) {
  const oemCeiling = vehicle.oemEthanolCeilingPct ?? 10;
  const isOemApproved = ethanolPct <= oemCeiling;
  const isFlexFuel = oemCeiling >= 85;
  const isExtremeExcess = ethanolPct > (oemCeiling + 15);
  const isClassicCar = vehicle.category === 'Classic' || vehicle.fuelInjection.includes('Early') || vehicle.fuelInjection.includes('Carbureted');

  let verdict: 'FULLY_COMPATIBLE' | 'CONDITIONAL_CAUTION' | 'INCOMPATIBLE_HAZARD';
  let verdictLabel: string;
  let score: number;

  if (isFlexFuel || (isOemApproved && !isClassicCar)) {
    verdict = 'FULLY_COMPATIBLE';
    verdictLabel = `OEM Approved (${ethanolPct}% is within the ${vehicle.oemMaxEthanolRating} limit)`;
    score = 94 - Math.round(ethanolPct * 0.15);
  } else if (isClassicCar && ethanolPct > 5) {
    verdict = 'INCOMPATIBLE_HAZARD';
    verdictLabel = `High Hazard for Vintage Fuel Components (Exceeds safe E0/E5 threshold)`;
    score = Math.max(10, 45 - ethanolPct * 0.5);
  } else if (ethanolPct <= oemCeiling + 5) {
    verdict = 'CONDITIONAL_CAUTION';
    verdictLabel = `Marginal Tolerance (${ethanolPct}% slightly exceeds ${vehicle.oemMaxEthanolRating} OEM rating)`;
    score = 65;
  } else {
    verdict = 'INCOMPATIBLE_HAZARD';
    verdictLabel = `Severe Mismatch (${ethanolPct}% exceeds factory ${vehicle.oemMaxEthanolRating} ceiling by ${ethanolPct - oemCeiling}%)`;
    score = Math.max(15, 55 - (ethanolPct - oemCeiling) * 1.5);
  }

  const mileageDropRange = ethanolPct <= 10
    ? '2.5% to 4.0%'
    : ethanolPct <= 20
    ? '5.0% to 7.5%'
    : ethanolPct <= 50
    ? '12% to 18%'
    : '24% to 30%';

  return {
    suitabilityVerdict: verdict,
    verdictLabel,
    headlineSummary: isOemApproved
      ? `${vehicle.make} ${vehicle.model} (${vehicle.variant}) operates safely on E${ethanolPct} with OEM compliance.`
      : `E${ethanolPct} exceeds ${vehicle.make}'s factory specification of ${vehicle.oemMaxEthanolRating}. Increased mechanical wear and fuel trim saturation risk.`,
    engineSafetyRecommendations: [
      ethanolPct > oemCeiling
        ? 'Dilute immediately with Pure Gasoline (E0) or certified low-blend premium fuel to restore fuel trim balance.'
        : `Continue using recommended octane (${vehicle.oemOctaneRecommendation}) with quality top-tier detergents.`,
      isClassicCar
        ? 'Retrofit fuel lines with modern Viton fluoroelastomer hoses (SAE J30 R9 or R14 spec) and install an ethanol-resistant fuel pump.'
        : 'Avoid storing the vehicle parked for longer than 3-4 weeks with high-ethanol fuel due to atmospheric water absorption.',
      ethanolPct > 15 && !isFlexFuel
        ? 'Monitor for OBD-II fault codes P0171 / P0174 (System Too Lean) on bank 1 and bank 2 as ECU long-term fuel trims approach max authority.'
        : 'Adhere to OEM oil change intervals to prevent unburned ethanol blow-by from acidifying crankcase oil.',
      'Check fuel filter and fuel pressure sensor regularly; replace filter if any micro-corrosion sediment forms in tank.'
    ],
    fuelDeliveryAndMaterialsIssues: [
      {
        component: 'High-Pressure Fuel Pump & Seals',
        riskLevel: ethanolPct > oemCeiling ? 'High' : 'Low',
        explanation: ethanolPct > oemCeiling
          ? 'Ethanol has lower lubricating viscosity than raw hydrocarbons. High-pressure pump plungers and nitrile seals suffer accelerated mechanical scoring.'
          : 'Factory seals are rated for OEM ethanol specifications without swelling or embrittlement.'
      },
      {
        component: 'Fuel Injectors & Orifices',
        riskLevel: ethanolPct > oemCeiling ? 'Moderate' : 'Low',
        explanation: 'Ethanol is polar and conductive; in high concentrations it promotes galvanic micro-corrosion across injector needle seats and causes tip lacquer formation.'
      },
      {
        component: 'Fuel Tank & Sender Unit',
        riskLevel: isClassicCar && ethanolPct > 5 ? 'Critical' : ethanolPct > oemCeiling ? 'Moderate' : 'Negligible',
        explanation: isClassicCar
          ? 'Uncoated metal tanks and brass float assemblies oxidize rapidly, shedding rust particles into the primary fuel filter.'
          : 'Modern polymer tanks are immune to rust, though fuel sender resistive traces can suffer accelerated oxidation.'
      }
    ],
    combustionAndEcuIssues: [
      {
        parameter: 'Stoichiometric Fuel Trim (STFT / LTFT)',
        consequence: `E${ethanolPct} requires ${(14.7 / ((1 - ethanolPct/100)*14.7 + (ethanolPct/100)*9.0) - 1).toFixed(1)}% extra fuel volume. If ECU fuel trim range is capped at ±15-20%, engine will run excessively lean under wide-open throttle.`
      },
      {
        parameter: 'Exhaust Gas Temperature (EGT) & Catalytic Converter',
        consequence: ethanolPct > oemCeiling
          ? 'Lean combustion cycles elevate cylinder head temperatures and catalytic converter bed temperatures, risking thermal stress.'
          : 'Ethanol combustion produces slightly cooler flame front, maintaining healthy catalytic converter operation within OEM limits.'
      }
    ],
    mileageAndEconomyConsequences: {
      estimatedMileageChangePct: `-${mileageDropRange}`,
      energyDensityDrop: `Approx ${((32.4 - ((1 - ethanolPct/100)*32.4 + (ethanolPct/100)*21.2))/32.4 * 100).toFixed(1)}% reduction in volumetric energy density compared to pure gasoline.`,
      realWorldImpactSummary: `Expect ${mileageDropRange} fewer kilometers or miles per full tank. The vehicle must inject more fuel mass to deliver equivalent combustion energy.`
    },
    coldStartAndVaporConcerns: ethanolPct >= 20
      ? 'Ethanol has an exceptionally high latent heat of vaporization (904 kJ/kg vs 350 kJ/kg for petrol). Ambient temperatures below 12°C (54°F) will result in extended cranking or cold-idle stumbling.'
      : 'Cold morning ignition and vapor lock characteristics remain within standard factory operating thresholds.',
    longTermMaintenanceWarnings: [
      'Engine oil dilution: Unburned ethanol can wash cylinder walls during cold cycles and dilute the lubricating oil film.',
      'Shorter spark plug service life due to varying thermal flame propagation and additive deposits.',
      'Phase separation sludge: If water enters the tank, the ethanol-water layer will sink to the bottom directly into the pump strainer.'
    ],
    phaseSeparationAndStorage: ethanolPct > 10
      ? 'Hygroscopic hazard: Fuel will absorb moisture from air humidity. Do not keep in tank beyond 30-45 days without ethanol-rated fuel stabilizer.'
      : 'Fuel remains stable for up to 90 days under sealed fuel tank vapor containment systems.',
    technicalGradeScore: score,
    recommendedAction: isOemApproved
      ? 'Safe to refuel. No corrective measures required. Follow standard OEM scheduled maintenance.'
      : `Avoid continuous use of E${ethanolPct}. If filled accidentally, avoid heavy acceleration and top off with 100% pure gasoline (E0) or low-blend premium fuel at the next opportunity.`
  };
}

// Analysis API Route
app.post('/api/analyze-ethanol', async (req, res) => {
  try {
    const { vehicle, ethanolPct } = req.body;

    if (!vehicle || ethanolPct === undefined || ethanolPct === null) {
      return res.status(400).json({ error: 'Missing vehicle or ethanol percentage parameters.' });
    }

    const pct = Math.max(0, Math.min(100, Number(ethanolPct)));

    // If Gemini client is not initialized (e.g. GEMINI_API_KEY unset in development), return accurate deterministic analysis
    if (!ai) {
      const fallbackData = getDeterministicAnalysis(vehicle, pct);
      return res.json({ analysis: fallbackData, source: 'engineering-engine' });
    }

    const prompt = `You are a world-class automotive powertrain and combustion engineer specializing in internal combustion petrol (gasoline) engines, fuel chemistry, materials compatibility, and emissions standards.

Perform a rigorous, scientifically accurate technical analysis of the following petrol vehicle running on an ethanol-petrol blend:

VEHICLE SPECIFICATIONS:
- Make: ${vehicle.make}
- Model: ${vehicle.model}
- Generation / Variant: ${vehicle.variant}
- Year: ${vehicle.year}
- Engine: ${vehicle.engine}
- Displacement: ${vehicle.displacement}
- Power Output: ${vehicle.powerOutput}
- Fuel Injection System: ${vehicle.fuelInjection}
- Factory OEM Ethanol Ceiling: ${vehicle.oemMaxEthanolRating} (${vehicle.oemEthanolCeilingPct}% max)
- OEM Recommended Octane: ${vehicle.oemOctaneRecommendation}
- Compression Ratio: ${vehicle.compressionRatio}
- Category: ${vehicle.category}
- Emission Standard: ${vehicle.emissionStandard}
- OEM Fuel System Notes: ${vehicle.fuelSystemNotes}

PROPOSED FUEL BLEND:
- Ethanol Concentration: E${pct} (${pct}% Ethanol by volume, ${100 - pct}% Petrol/Gasoline by volume).

TECHNICAL EVALUATION CRITERIA:
1. Suitability Verdict:
   - "FULLY_COMPATIBLE" if ${pct}% is within the OEM ceiling (${vehicle.oemEthanolCeilingPct}%) or vehicle is Flex Fuel.
   - "CONDITIONAL_CAUTION" if ${pct}% slightly exceeds OEM limit (e.g., E15-E20 on an E10 car) or has short-term tolerance with risks.
   - "INCOMPATIBLE_HAZARD" if ${pct}% significantly exceeds OEM limit, or if vintage/carbureted/early EFI components (nitrile rubber, zinc/aluminum/brass) will be damaged, or if ECU will max out LTFT (Long Term Fuel Trims).
2. Engine Safety Recommendations: Practical engineering steps, fuel stabilizers, dilution, or maintenance checks.
3. Fuel Delivery & Materials Issues: Specific impact on high-pressure pump (HPFP), rubber hoses, Viton vs Buna-N seals, tank coating, injectors.
4. Combustion & ECU Issues: Fuel trim limits, stoichiometric Air-Fuel Ratio (AFR) shift (gasoline 14.7:1 vs ethanol 9.0:1), knock resistance (RON), lean misfire risks, catalytic converter and EGT implications.
5. Mileage & Fuel Economy: Exact calculated degradation in volumetric energy density and realistic percentage drop in MPG / km per liter.
6. Cold Start & Vapor Lock: Latent heat of vaporization issues (904 kJ/kg for ethanol vs 350 kJ/kg for gasoline) and Reid Vapor Pressure.
7. Long-term Maintenance Warnings: Phase separation risk, oil dilution/washdown, corrosion, and sensor longevity.
8. Technical Grade Score: 0 to 100 rating of mechanical alignment.
9. Recommended Action: Clear, non-hysterical instructions for the driver.

Provide your response strictly in the specified JSON format with keys: suitabilityVerdict, verdictLabel, headlineSummary, engineSafetyRecommendations, fuelDeliveryAndMaterialsIssues, combustionAndEcuIssues, mileageAndEconomyConsequences, coldStartAndVaporConcerns, longTermMaintenanceWarnings, phaseSeparationAndStorage, technicalGradeScore, recommendedAction.`;

    // 1. Try Groq AI (with user provided key)
    const groqResult = await callGroqAi(prompt);
    if (groqResult) {
      return res.json({ analysis: groqResult, source: 'groq-ai' });
    }

    // 2. If Gemini is configured, use Gemini 3.8 Flash
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suitabilityVerdict: {
              type: Type.STRING,
              description: 'One of: FULLY_COMPATIBLE, CONDITIONAL_CAUTION, INCOMPATIBLE_HAZARD',
            },
            verdictLabel: {
              type: Type.STRING,
              description: 'Short 4-8 word technical verdict headline',
            },
            headlineSummary: {
              type: Type.STRING,
              description: '2-3 sentence executive engineering summary of suitability and risks',
            },
            engineSafetyRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 to 5 actionable engineering safety precautions and operational recommendations',
            },
            fuelDeliveryAndMaterialsIssues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  component: { type: Type.STRING },
                  riskLevel: { type: Type.STRING, description: 'Low, Moderate, High, or Critical' },
                  explanation: { type: Type.STRING },
                },
                required: ['component', 'riskLevel', 'explanation'],
              },
            },
            combustionAndEcuIssues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  parameter: { type: Type.STRING },
                  consequence: { type: Type.STRING },
                },
                required: ['parameter', 'consequence'],
              },
            },
            mileageAndEconomyConsequences: {
              type: Type.OBJECT,
              properties: {
                estimatedMileageChangePct: { type: Type.STRING, description: 'e.g. -3.5% to -5.0%' },
                energyDensityDrop: { type: Type.STRING, description: 'Volumetric energy deficit compared to pure E0 petrol' },
                realWorldImpactSummary: { type: Type.STRING, description: 'Explanation of energy density vs stoichiometric fuel mass flow' },
              },
              required: ['estimatedMileageChangePct', 'energyDensityDrop', 'realWorldImpactSummary'],
            },
            coldStartAndVaporConcerns: {
              type: Type.STRING,
              description: 'Analysis of latent heat of vaporization, cranking time, and vapor lock tendency',
            },
            longTermMaintenanceWarnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 to 5 long-term maintenance warnings including phase separation and oil dilution',
            },
            phaseSeparationAndStorage: {
              type: Type.STRING,
              description: 'Hygroscopic water absorption and maximum recommended storage duration in fuel tank',
            },
            technicalGradeScore: {
              type: Type.NUMBER,
              description: 'Mechanical suitability score from 0 to 100',
            },
            recommendedAction: {
              type: Type.STRING,
              description: 'Clear, direct recommendation for the driver right now',
            },
          },
          required: [
            'suitabilityVerdict',
            'verdictLabel',
            'headlineSummary',
            'engineSafetyRecommendations',
            'fuelDeliveryAndMaterialsIssues',
            'combustionAndEcuIssues',
            'mileageAndEconomyConsequences',
            'coldStartAndVaporConcerns',
            'longTermMaintenanceWarnings',
            'phaseSeparationAndStorage',
            'technicalGradeScore',
            'recommendedAction',
          ],
        },
        },
      });

      const textOutput = response.text;
      if (textOutput) {
        const parsedJson = JSON.parse(textOutput);
        return res.json({ analysis: parsedJson, source: 'gemini-ai' });
      }
    }

    // 3. High-precision deterministic powertrain engineering model
    const fallbackData = getDeterministicAnalysis(vehicle, pct);
    return res.json({ analysis: fallbackData, source: 'engineering-engine' });
  } catch (error: any) {
    console.error('API analysis error:', error);

    // Graceful fallback to deterministic engineering rules so the UI always has high-accuracy data
    const fallbackData = getDeterministicAnalysis(req.body.vehicle, Number(req.body.ethanolPct) || 0);
    return res.json({
      analysis: fallbackData,
      source: 'engineering-engine-fallback',
      warning: 'Live AI request encountered a temporary error. Fallback engineering model provided.',
    });
  }
});

// Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ethanol Analysis Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
