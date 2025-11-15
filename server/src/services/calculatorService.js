// FSI calculation logic based on UDCPR 2020
export function calculateFSI(zone, plotArea, roadWidth, landUse) {
  let baseFSI = 1.0;
  let maxHeight = 15;
  let tdr = false;
  let notes = [];

  // Zone-based FSI (simplified logic - expand based on actual UDCPR tables)
  const zoneRules = {
    'Residential': { fsi: 1.0, height: 15 },
    'Commercial': { fsi: 1.5, height: 24 },
    'Industrial': { fsi: 1.0, height: 12 },
    'Mixed': { fsi: 1.2, height: 18 }
  };

  if (zoneRules[zone]) {
    baseFSI = zoneRules[zone].fsi;
    maxHeight = zoneRules[zone].height;
  }

  // Road width bonus
  if (roadWidth >= 12) {
    baseFSI += 0.2;
    notes.push('Road width bonus: +0.2 FSI');
  }

  // TDR eligibility
  if (plotArea > 1000) {
    tdr = true;
    notes.push('Eligible for TDR');
  }

  return {
    fsi: baseFSI,
    maxHeight,
    tdr,
    notes
  };
}

export function calculateSetbacks(zone, plotArea, roadWidth, buildingType) {
  // Simplified setback calculation - expand based on UDCPR tables
  let front = 3, rear = 3, side = 1.5;

  if (plotArea > 500) {
    front = 5;
    rear = 4;
    side = 2;
  }

  if (roadWidth >= 12) {
    front = Math.max(front, roadWidth * 0.3);
  }

  return { front, rear, side1: side, side2: side };
}
