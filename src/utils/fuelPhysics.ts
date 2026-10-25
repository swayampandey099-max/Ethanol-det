export interface FuelPhysicsMetrics {
  ethanolPct: number;
  energyDensityMjL: number; // MJ per Liter
  energyDeficitPct: number; // % drop vs E0
  estimatedMileageImpactPct: number; // expected % change in MPG / km/L
  stoichiometricAfr: number; // e.g. 14.7 down to 9.8
  fuelMassIncreaseRequiredPct: number; // fuel injection volume needed for Lambda 1.0
  octaneBoostEstRon: number; // estimated RON boost
  latentHeatVaporizationKjKg: number;
  phaseSeparationRisk: 'Low' | 'Moderate' | 'Elevated' | 'Severe';
  reidVaporPressureClass: string;
}

export function calculateFuelPhysics(ethanolPct: number, baselineRon: number = 91): FuelPhysicsMetrics {
  const fraction = Math.max(0, Math.min(100, ethanolPct)) / 100;
  
  // Energy densities
  const gasolineMjL = 32.4;
  const ethanolMjL = 21.2;
  const energyDensity = (1 - fraction) * gasolineMjL + fraction * ethanolMjL;
  const energyDeficit = ((gasolineMjL - energyDensity) / gasolineMjL) * 100;

  // Practical mileage impact (accounting for slight thermodynamic combustion efficiency offset at low blends)
  let mileagePenalty = energyDeficit;
  if (ethanolPct <= 10) {
    mileagePenalty = energyDeficit * 0.95; // Slight thermal offset
  } else if (ethanolPct <= 20) {
    mileagePenalty = energyDeficit * 0.98;
  }

  // Stoichiometric Air-Fuel Ratio
  const stoichGasoline = 14.7;
  const stoichEthanol = 9.0;
  const stoichiometricAfr = (1 - fraction) * stoichGasoline + fraction * stoichEthanol;

  // Mass of fuel required relative to pure gasoline (14.7 / stoich) - 1
  const fuelMassIncrease = ((stoichGasoline / stoichiometricAfr) - 1) * 100;

  // Octane blend estimation
  // Ethanol has non-linear blending octane value (~108 to 112 RON blending)
  const octaneBoost = fraction * (108 - baselineRon) * 0.75;
  const finalRon = baselineRon + octaneBoost;

  // Latent heat
  const latentHeat = (1 - fraction) * 350 + fraction * 904;

  // Phase separation & storage vulnerability
  let risk: 'Low' | 'Moderate' | 'Elevated' | 'Severe' = 'Low';
  if (ethanolPct === 0) {
    risk = 'Low';
  } else if (ethanolPct <= 10) {
    risk = 'Low';
  } else if (ethanolPct <= 20) {
    risk = 'Moderate';
  } else if (ethanolPct <= 50) {
    risk = 'Elevated';
  } else {
    risk = 'Severe';
  }

  let rvpClass = 'Standard Summer/Winter Blend Stability';
  if (ethanolPct > 0 && ethanolPct <= 10) {
    rvpClass = 'Near-azeotropic blend: elevated RVP (+1.0 psi), slight hot vapor lock propensity in warm climates';
  } else if (ethanolPct > 10 && ethanolPct <= 30) {
    rvpClass = 'Moderate volatility profile; cold start enrichment required below 15°C';
  } else if (ethanolPct > 30) {
    rvpClass = 'High latent heat vaporization: severe cold crank ignition delay below 10°C without block/intake preheater';
  } else {
    rvpClass = 'Pure Hydrocarbon: maximum atmospheric stability and long storage shelf-life';
  }

  return {
    ethanolPct,
    energyDensityMjL: Number(energyDensity.toFixed(2)),
    energyDeficitPct: Number(energyDeficit.toFixed(1)),
    estimatedMileageImpactPct: Number(-mileagePenalty.toFixed(1)),
    stoichiometricAfr: Number(stoichiometricAfr.toFixed(2)),
    fuelMassIncreaseRequiredPct: Number(fuelMassIncrease.toFixed(1)),
    octaneBoostEstRon: Number(finalRon.toFixed(1)),
    latentHeatVaporizationKjKg: Math.round(latentHeat),
    phaseSeparationRisk: risk,
    reidVaporPressureClass: rvpClass,
  };
}
