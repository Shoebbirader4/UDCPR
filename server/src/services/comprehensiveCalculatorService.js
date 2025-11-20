// Comprehensive UDCPR 2020 Calculator Service

/**
 * Calculate FSI based on comprehensive UDCPR 2020 rules
 */
export function calculateComprehensiveFSI(params) {
  const { district, zone, plotArea, roadWidth, landUse, floors, isTOD, hasHeritage } = params;
  
  let basicFSI = 1.0;
  let premiumFSI = 0;
  let tdrFSI = 0;
  let todFSI = 0;
  let maxFSI = 1.0;
  let notes = [];
  let calculations = [];
  let roadBonus = 0;

  // Base FSI by zone and district
  if (district === 'Mumbai City' || district === 'Mumbai Suburban') {
    // Mumbai-specific FSI
    switch(zone) {
      case 'Residential':
        basicFSI = district === 'Mumbai City' ? 1.33 : 1.0;
        premiumFSI = 1.33;
        maxFSI = 3.0;
        notes.push(`Mumbai ${district === 'Mumbai City' ? 'Island City' : 'Suburbs'} base FSI`);
        break;
      case 'Commercial':
        basicFSI = 2.0;
        premiumFSI = 2.0;
        maxFSI = 5.0;
        notes.push('Mumbai commercial FSI');
        break;
      case 'Industrial':
        basicFSI = 1.0;
        maxFSI = 1.5;
        break;
      case 'Mixed':
        basicFSI = 1.5;
        premiumFSI = 1.0;
        maxFSI = 3.0;
        break;
    }
  } else {
    // Rest of Maharashtra (UDCPR 2020 Standard)
    switch(zone) {
      case 'Residential':
        basicFSI = 1.10;
        premiumFSI = 0.40;
        maxFSI = 1.5;
        break;
      case 'Commercial':
        basicFSI = 1.5;
        premiumFSI = 1.0;
        maxFSI = 2.5;
        break;
      case 'Industrial':
        basicFSI = 1.0;
        maxFSI = 1.5;
        break;
      case 'Mixed':
        basicFSI = 1.2;
        premiumFSI = 0.8;
        maxFSI = 2.0;
        break;
    }
  }

  calculations.push({ label: 'Basic FSI', value: basicFSI, description: `${zone} zone basic FSI (free)` });

  // Road width bonus
  if (roadWidth >= 12) {
    roadBonus = 0.2;
    calculations.push({ label: 'Road Width Bonus', value: `+${roadBonus}`, description: 'Road width ≥ 12m' });
    notes.push(`Road width bonus: +${roadBonus} FSI (road ≥ 12m)`);
  }

  const baseFSI = basicFSI + roadBonus;

  // TOD FSI
  if (isTOD) {
    todFSI = 1.0;
    calculations.push({ label: 'TOD FSI', value: `+${todFSI}`, description: 'Transit Oriented Development zone' });
    notes.push('TOD zone: Additional 1.0 FSI available');
  }

  // Heritage building incentive
  if (hasHeritage) {
    const heritageBonus = 0.33;
    todFSI += heritageBonus;
    calculations.push({ label: 'Heritage Incentive', value: `+${heritageBonus}`, description: 'Heritage conservation' });
    notes.push(`Heritage conservation incentive: +${heritageBonus} FSI`);
  }

  const totalPermissibleFSI = Math.min(baseFSI + todFSI, maxFSI);
  
  // TDR eligibility - calculate available TDR FSI
  if (plotArea > 1000) {
    tdrFSI = Math.max(0, maxFSI - totalPermissibleFSI);
    if (tdrFSI > 0) {
      calculations.push({ 
        label: 'TDR Available', 
        value: `${tdrFSI.toFixed(2)} FSI`, 
        description: `Plot > 1000 sq.m, can purchase up to ${tdrFSI.toFixed(2)} FSI` 
      });
      notes.push(`TDR eligible: Can purchase up to ${tdrFSI.toFixed(2)} FSI to reach max ${maxFSI} FSI`);
    }
  }

  // Premium FSI breakdown
  if (premiumFSI > 0) {
    calculations.push({ 
      label: 'Premium FSI', 
      value: `${premiumFSI} FSI`, 
      description: 'Purchasable premium FSI (separate from basic)' 
    });
    notes.push(`Premium FSI: ${premiumFSI} FSI available for purchase`);
  }

  // Calculate built-up areas for different scenarios
  const builtUpBasic = plotArea * baseFSI;
  const builtUpWithPremium = premiumFSI > 0 ? plotArea * Math.min(baseFSI + premiumFSI, maxFSI) : 0;
  const builtUpWithTDR = tdrFSI > 0 ? plotArea * maxFSI : 0;

  return {
    basicFSI,
    baseFSI,
    premiumFSI,
    tdrFSI,
    todFSI,
    roadBonus,
    totalPermissibleFSI,
    maxFSI,
    builtUpBasic: parseFloat(builtUpBasic.toFixed(2)),
    builtUpWithPremium: parseFloat(builtUpWithPremium.toFixed(2)),
    builtUpWithTDR: parseFloat(builtUpWithTDR.toFixed(2)),
    calculations,
    notes
  };
}

/**
 * Calculate setbacks based on UDCPR 2020
 */
export function calculateComprehensiveSetbacks(params) {
  const { district, plotArea, roadWidth, buildingHeight, floors } = params;
  
  let front = 3, rear = 3, side1 = 1.5, side2 = 1.5;
  let notes = [];
  let calculations = [];

  // Mumbai-specific setbacks
  if (district === 'Mumbai City' || district === 'Mumbai Suburban') {
    // Front setback based on plot size
    if (plotArea <= 300) {
      front = 3;
      notes.push('Small plot (≤300 sq.m): 3m front setback');
    } else if (plotArea <= 1000) {
      front = 4.5;
      notes.push('Medium plot (300-1000 sq.m): 4.5m front setback');
    } else {
      front = 6;
      notes.push('Large plot (>1000 sq.m): 6m front setback');
    }

    // Road width factor - capped at 6m to prevent unbuildable plots
    if (roadWidth >= 12) {
      const roadFactor = Math.min(roadWidth * 0.33, 6);
      if (roadFactor > front) {
        front = roadFactor;
        notes.push(`Front setback: ${front.toFixed(1)}m (1/3 of road width, max 6m)`);
      }
    }

    // Side setbacks based on floors
    if (floors <= 2) {
      side1 = 0;
      side2 = 0;
      notes.push('Up to 2 floors: No side setback required');
    } else if (floors <= 4) {
      side1 = 1.5;
      side2 = 1.5;
      notes.push('3-4 floors: 1.5m side setback');
    } else {
      side1 = 3;
      side2 = 3;
      notes.push('5+ floors: 3m side setback');
    }

    // Rear setback
    rear = 3;
    if (buildingHeight > 24) {
      rear = 4.5;
      notes.push('High-rise (>24m): Increased rear setback');
    }
  } else {
    // Rest of Maharashtra
    if (plotArea <= 250) {
      front = 3;
      rear = 3;
      side1 = 1.5;
      side2 = 1.5;
    } else if (plotArea <= 500) {
      front = 4;
      rear = 3;
      side1 = 2;
      side2 = 2;
    } else {
      front = 5;
      rear = 4;
      side1 = 2.5;
      side2 = 2.5;
    }

    // Road width factor - capped at 6m to prevent unbuildable plots
    if (roadWidth >= 12) {
      const roadFactor = Math.min(roadWidth * 0.3, 6);
      if (roadFactor > front) {
        front = roadFactor;
        notes.push(`Front setback: ${front.toFixed(1)}m (30% of road width, max 6m)`);
      }
    }
  }

  calculations.push(
    { label: 'Front Setback', value: `${front.toFixed(1)}m`, description: 'From plot boundary to building' },
    { label: 'Rear Setback', value: `${rear.toFixed(1)}m`, description: 'Back of plot' },
    { label: 'Side Setback 1', value: `${side1.toFixed(1)}m`, description: 'Left side' },
    { label: 'Side Setback 2', value: `${side2.toFixed(1)}m`, description: 'Right side' }
  );

  return {
    front: parseFloat(front.toFixed(1)),
    rear: parseFloat(rear.toFixed(1)),
    side1: parseFloat(side1.toFixed(1)),
    side2: parseFloat(side2.toFixed(1)),
    calculations,
    notes
  };
}

/**
 * Calculate parking requirements
 */
export function calculateParking(params) {
  const { landUse, builtUpArea, dwellingUnits, carpetAreaPerUnit } = params;
  
  let ecs = 0;
  let notes = [];
  let calculations = [];

  switch(landUse) {
    case 'Residential':
      if (dwellingUnits && carpetAreaPerUnit) {
        if (carpetAreaPerUnit <= 50) {
          ecs = dwellingUnits * 1;
          notes.push('1 ECS per unit (≤50 sq.m carpet)');
        } else if (carpetAreaPerUnit <= 100) {
          ecs = dwellingUnits * 2;
          notes.push('2 ECS per unit (50-100 sq.m carpet)');
        } else {
          ecs = dwellingUnits * 3;
          notes.push('3 ECS per unit (>100 sq.m carpet)');
        }
      } else if (builtUpArea) {
        ecs = Math.ceil(builtUpArea / 100);
        notes.push('1 ECS per 100 sq.m built-up area (default)');
      }
      break;

    case 'Commercial':
      if (builtUpArea) {
        ecs = Math.ceil(builtUpArea / 75);
        notes.push('1 ECS per 75 sq.m for offices');
      }
      break;

    case 'Retail/Mall':
      if (builtUpArea) {
        ecs = Math.ceil(builtUpArea / 50);
        notes.push('1 ECS per 50 sq.m for retail/mall');
      }
      break;

    case 'Restaurant':
      if (builtUpArea) {
        ecs = Math.ceil(builtUpArea / 50);
        notes.push('1 ECS per 50 sq.m for restaurant');
      }
      break;

    case 'Industrial':
      if (builtUpArea) {
        ecs = Math.ceil(builtUpArea / 150);
        notes.push('1 ECS per 150 sq.m for industrial');
      }
      break;

    case 'Mixed':
      if (builtUpArea) {
        ecs = Math.ceil(builtUpArea / 85);
        notes.push('1 ECS per 85 sq.m for mixed use (average)');
      }
      break;
  }

  calculations.push(
    { label: 'Required ECS', value: ecs, description: 'Equivalent Car Spaces' },
    { label: 'Parking Area', value: `${(ecs * 25).toFixed(0)} sq.m`, description: '25 sq.m per ECS (approx)' }
  );

  return {
    ecs,
    parkingArea: ecs * 25,
    calculations,
    notes
  };
}

/**
 * Calculate building height restrictions
 */
export function calculateHeight(params) {
  const { zone, plotArea, roadWidth, district, floors, buildingHeight } = params;
  
  let maxHeight = 15;
  let maxFloors = 4;
  let notes = [];
  const floorHeight = 3.5; // Standard floor-to-floor height

  if (district === 'Mumbai City' || district === 'Mumbai Suburban') {
    switch(zone) {
      case 'Residential':
        maxHeight = 24;
        maxFloors = 7;
        notes.push('Mumbai residential: Up to 24m / 7 floors');
        break;
      case 'Commercial':
        maxHeight = 40;
        maxFloors = 12;
        notes.push('Mumbai commercial: Up to 40m / 12 floors');
        break;
      case 'Mixed':
        maxHeight = 30;
        maxFloors = 9;
        break;
    }
  } else {
    switch(zone) {
      case 'Residential':
        maxHeight = 15;
        maxFloors = 4;
        break;
      case 'Commercial':
        maxHeight = 24;
        maxFloors = 7;
        break;
      case 'Mixed':
        maxHeight = 18;
        maxFloors = 5;
        break;
    }
  }

  // Road width factor
  if (roadWidth < 9) {
    maxHeight = Math.min(maxHeight, 12);
    maxFloors = Math.min(maxFloors, 3);
    notes.push('Narrow road (<9m): Height restricted to 12m / 3 floors');
  }

  // Large plot bonus
  if (plotArea > 2000) {
    notes.push('Large plot (>2000 sq.m): May qualify for high-rise approval');
  }

  // Calculate actual/proposed height if floors provided
  let proposedHeight = null;
  let proposedFloors = null;
  let isCompliant = true;
  
  if (floors && floors > 0) {
    proposedFloors = parseInt(floors);
    proposedHeight = proposedFloors * floorHeight;
    
    // Check compliance
    if (proposedFloors > maxFloors) {
      isCompliant = false;
      notes.push(`⚠️ Proposed ${proposedFloors} floors exceeds maximum ${maxFloors} floors`);
    }
    if (proposedHeight > maxHeight) {
      isCompliant = false;
      notes.push(`⚠️ Proposed ${proposedHeight}m height exceeds maximum ${maxHeight}m`);
    }
  } else if (buildingHeight && buildingHeight > 0) {
    proposedHeight = parseFloat(buildingHeight);
    proposedFloors = Math.floor(proposedHeight / floorHeight);
    
    if (proposedHeight > maxHeight) {
      isCompliant = false;
      notes.push(`⚠️ Proposed ${proposedHeight}m height exceeds maximum ${maxHeight}m`);
    }
  }

  return {
    maxHeight,
    maxFloors,
    floorHeight,
    proposedHeight,
    proposedFloors,
    isCompliant,
    notes
  };
}

/**
 * Calculate built-up area
 */
export function calculateBuiltUpArea(params) {
  const { plotArea, fsi, floors } = params;
  
  const totalBuiltUp = plotArea * fsi;
  const perFloor = floors > 0 ? totalBuiltUp / floors : totalBuiltUp;
  const coverage = (perFloor / plotArea) * 100;

  return {
    totalBuiltUp: parseFloat(totalBuiltUp.toFixed(2)),
    perFloor: parseFloat(perFloor.toFixed(2)),
    coverage: parseFloat(coverage.toFixed(1)),
    notes: [
      `Total built-up area: ${totalBuiltUp.toFixed(0)} sq.m`,
      `Per floor: ${perFloor.toFixed(0)} sq.m`,
      `Ground coverage: ${coverage.toFixed(1)}%`
    ]
  };
}

/**
 * Calculate ancillary areas (not counted in FSI)
 */
export function calculateAncillaryAreas(params) {
  const { builtUpArea, floors } = params;
  
  const calculations = [];
  const notes = [];
  
  // Staircase and lift (10% of built-up area)
  const staircaseLift = builtUpArea * 0.10;
  calculations.push({
    label: 'Staircase & Lift',
    value: `${staircaseLift.toFixed(0)} sq.m`,
    description: '10% of built-up area (not counted in FSI)'
  });
  
  // Mumty (roof structure) - typically 15 sq.m per floor
  const mumty = floors > 0 ? 15 : 0;
  if (mumty > 0) {
    calculations.push({
      label: 'Mumty (Roof Structure)',
      value: `${mumty} sq.m`,
      description: 'Staircase head room on terrace'
    });
  }
  
  // Water tanks - typically 2% of built-up
  const waterTanks = builtUpArea * 0.02;
  calculations.push({
    label: 'Water Tanks',
    value: `${waterTanks.toFixed(0)} sq.m`,
    description: '2% of built-up area'
  });
  
  // Meter room, ducts, shafts - 3% of built-up
  const services = builtUpArea * 0.03;
  calculations.push({
    label: 'Services (Meters, Ducts)',
    value: `${services.toFixed(0)} sq.m`,
    description: '3% of built-up area'
  });
  
  const totalAncillary = staircaseLift + mumty + waterTanks + services;
  const totalConstructible = builtUpArea + totalAncillary;
  
  notes.push('Ancillary areas are NOT counted in FSI calculations');
  notes.push('These areas are permitted in addition to FSI-based built-up area');
  notes.push(`Total constructible area: ${totalConstructible.toFixed(0)} sq.m`);
  
  return {
    staircaseLift: parseFloat(staircaseLift.toFixed(2)),
    mumty,
    waterTanks: parseFloat(waterTanks.toFixed(2)),
    services: parseFloat(services.toFixed(2)),
    totalAncillary: parseFloat(totalAncillary.toFixed(2)),
    totalConstructible: parseFloat(totalConstructible.toFixed(2)),
    calculations,
    notes
  };
}

/**
 * Comprehensive calculator - all calculations in one
 */
export function calculateAll(params) {
  const fsiResults = calculateComprehensiveFSI(params);
  const setbackResults = calculateComprehensiveSetbacks(params);
  const heightResults = calculateHeight(params);
  
  const actualFloors = params.floors || heightResults.maxFloors;
  
  const builtUpResults = calculateBuiltUpArea({
    plotArea: params.plotArea,
    fsi: fsiResults.totalPermissibleFSI,
    floors: actualFloors
  });
  
  const parkingResults = calculateParking({
    landUse: params.landUse,
    builtUpArea: builtUpResults.totalBuiltUp,
    dwellingUnits: params.dwellingUnits,
    carpetAreaPerUnit: params.carpetAreaPerUnit
  });

  const ancillaryResults = calculateAncillaryAreas({
    builtUpArea: builtUpResults.totalBuiltUp,
    floors: actualFloors
  });

  return {
    fsi: fsiResults,
    setbacks: setbackResults,
    height: heightResults,
    builtUp: builtUpResults,
    parking: parkingResults,
    ancillary: ancillaryResults,
    summary: {
      plotArea: params.plotArea,
      permissibleFSI: fsiResults.totalPermissibleFSI,
      maxBuiltUp: builtUpResults.totalBuiltUp,
      ancillaryArea: ancillaryResults.totalAncillary,
      totalConstructible: ancillaryResults.totalConstructible,
      maxHeight: heightResults.maxHeight,
      maxFloors: heightResults.maxFloors,
      requiredParking: parkingResults.ecs,
      setbacks: {
        front: setbackResults.front,
        rear: setbackResults.rear,
        side1: setbackResults.side1,
        side2: setbackResults.side2
      }
    }
  };
}
