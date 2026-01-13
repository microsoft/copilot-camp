const fs = require('fs');
const path = require('path');

// Helper functions
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = (arr) => arr[randomInt(0, arr.length - 1)];
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const formatDate = (date) => date.toISOString();

// Data pools
const cities = [
  { city: "Seattle", state: "WA", zip: "98101" },
  { city: "Portland", state: "OR", zip: "97201" },
  { city: "Spokane", state: "WA", zip: "99201" },
  { city: "Eugene", state: "OR", zip: "97401" },
  { city: "Tacoma", state: "WA", zip: "98401" },
  { city: "Salem", state: "OR", zip: "97301" },
  { city: "Bellevue", state: "WA", zip: "98004" },
  { city: "Bend", state: "OR", zip: "97701" },
  { city: "Vancouver", state: "WA", zip: "98660" },
  { city: "Olympia", state: "WA", zip: "98501" }
];

const firstNames = ["John", "Maria", "James", "Sarah", "Michael", "Jennifer", "David", "Lisa", "Robert", "Emily", 
  "William", "Jessica", "Richard", "Amanda", "Thomas", "Michelle", "Christopher", "Melissa", "Daniel", "Kimberly",
  "Matthew", "Laura", "Anthony", "Rebecca", "Mark", "Stephanie", "Donald", "Nicole", "Steven", "Angela"];

const lastNames = ["Smith", "Johnson", "Garcia", "Rodriguez", "Martinez", "Williams", "Brown", "Jones", "Miller", "Davis",
  "Wilson", "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White",
  "Harris", "Clark", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott"];

const streets = ["Main St", "Oak Ave", "Pine Rd", "Maple Dr", "Cedar Ln", "Elm St", "Washington Blvd", "Lincoln Ave",
  "Park Pl", "Lake View Dr", "Mountain Rd", "River St", "Forest Ave", "Hill Crest Dr", "Valley Rd"];

const damageTypes = [
  { primary: "Roof damage", severity: ["minor", "moderate", "severe"], secondary: "Storm damage" },
  { primary: "Water damage", severity: ["minor", "moderate", "severe"], secondary: "Pipe leak damage" },
  { primary: "Fire damage", severity: ["minor", "moderate", "severe"], secondary: "Smoke damage" },
  { primary: "Wind damage", severity: ["minor", "moderate", "severe"], secondary: "Storm damage" },
  { primary: "Hail damage", severity: ["minor", "moderate", "severe"], secondary: "Storm damage" },
  { primary: "Flooding", severity: ["minor", "moderate", "severe"], secondary: "Water damage" },
  { primary: "Structural damage", severity: ["minor", "moderate", "severe"], secondary: "Foundation issues" },
  { primary: "Electrical damage", severity: ["minor", "moderate", "severe"], secondary: "Fire hazard" },
  { primary: "Mold damage", severity: ["minor", "moderate", "severe"], secondary: "Water damage" },
  { primary: "Vandalism", severity: ["minor", "moderate", "severe"], secondary: "Property damage" }
];

const claimStatuses = [
  "Open - Claim is under investigation",
  "Under Investigation - Claim is being reviewed by adjusters",
  "Approved - Claim approved for payment",
  "Pending Documentation - Awaiting additional information",
  "In Repair - Repairs in progress",
  "Closed - Claim settled and closed"
];

const inspectionStatuses = ["scheduled", "in-progress", "completed", "cancelled"];
const taskTypes = ["initial", "follow-up", "final", "re-inspection"];
const priorities = ["low", "medium", "high", "urgent"];

// Generate Inspectors (20 total)
function generateInspectors() {
  const specializations = [
    ["Roofing", "Storm Damage"],
    ["Water Damage", "Plumbing"],
    ["Fire Damage", "Smoke Assessment", "Electrical"],
    ["Structural", "Foundation", "General"],
    ["Mold", "Water Damage", "Air Quality"],
    ["HVAC", "Mechanical Systems"],
    ["Wind Damage", "Storm Damage"],
    ["Hail Damage", "Roof Assessment"],
    ["Flood Damage", "Water Intrusion"],
    ["General", "Property Assessment"]
  ];

  const inspectors = [];
  for (let i = 0; i < 20; i++) {
    inspectors.push({
      id: `inspector-${String(i + 1).padStart(3, '0')}`,
      name: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
      email: `inspector${i + 1}@zava.com`,
      phone: `555-${String(randomInt(1000, 9999))}`,
      licenseNumber: `INS-${randomInt(10000, 99999)}`,
      specializations: randomElement(specializations)
    });
  }
  return inspectors;
}

// Generate Contractors (30 total)
function generateContractors() {
  const businessTypes = [
    "Roofing Solutions", "Restoration Services", "General Contractors", "Construction Co",
    "Repair Specialists", "Property Services", "Emergency Restoration", "Building Services",
    "Damage Repair Inc", "Professional Contractors"
  ];

  const specialtiesList = [
    ["Roofing", "Storm Damage Repair", "Emergency Services"],
    ["Water Damage Restoration", "Mold Remediation", "Flood Cleanup"],
    ["General Contracting", "Structural Repair", "Renovation"],
    ["Fire Damage Restoration", "Smoke Cleanup", "Odor Removal"],
    ["HVAC Services", "Mechanical Repair", "System Installation"],
    ["Electrical Services", "Wiring Repair", "System Upgrades"],
    ["Plumbing Services", "Pipe Repair", "Water Line Installation"],
    ["Exterior Siding", "Window Replacement", "Door Installation"],
    ["Foundation Repair", "Structural Engineering", "Waterproofing"],
    ["Emergency Services", "24/7 Response", "Disaster Recovery"]
  ];

  const contractors = [];
  
  // Add the 3 specific contractors from embedded knowledge first
  contractors.push({
    id: 'contractor-001',
    name: 'Mike Thompson',
    businessName: 'Thompson Roofing Solutions',
    email: 'mike@thompsonroofing.com',
    phone: '555-0789',
    address: {
      street: '456 Industrial Ave',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98102',
      country: 'USA'
    },
    licenseNumber: 'WA-ROOF-2024-001',
    insuranceCertificate: 'INS-CERT-2024-001',
    specialties: ['Roofing', 'Storm Damage Repair', 'Emergency Services'],
    rating: 4.8,
    isPreferred: true,
    isActive: true
  });

  contractors.push({
    id: 'contractor-002',
    name: 'Lisa Chen',
    businessName: 'Pacific Water Restoration',
    email: 'lisa@pacificwater.com',
    phone: '555-0234',
    address: {
      street: '789 Commerce St',
      city: 'Portland',
      state: 'OR',
      zipCode: '97205',
      country: 'USA'
    },
    licenseNumber: 'OR-WATER-2024-002',
    insuranceCertificate: 'INS-CERT-2024-002',
    specialties: ['Water Damage Restoration', 'Mold Remediation', 'Flood Cleanup'],
    rating: 4.9,
    isPreferred: true,
    isActive: true
  });

  contractors.push({
    id: 'contractor-003',
    name: 'Robert Wilson',
    businessName: 'Wilson General Contractors',
    email: 'rob@wilsoncontractors.com',
    phone: '555-0567',
    address: {
      street: '321 Builder Blvd',
      city: 'Spokane',
      state: 'WA',
      zipCode: '99201',
      country: 'USA'
    },
    licenseNumber: 'WA-GEN-2024-003',
    insuranceCertificate: 'INS-CERT-2024-003',
    specialties: ['General Contracting', 'Structural Repair', 'Renovation'],
    rating: 4.6,
    isPreferred: true,
    isActive: true
  });

  // Generate the remaining 27 contractors randomly
  for (let i = 3; i < 30; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const location = randomElement(cities);
    
    contractors.push({
      id: `contractor-${String(i + 1).padStart(3, '0')}`,
      name: `${firstName} ${lastName}`,
      businessName: `${lastName} ${randomElement(businessTypes)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@contractor${i + 1}.com`,
      phone: `555-${String(randomInt(1000, 9999))}`,
      address: {
        street: `${randomInt(100, 9999)} ${randomElement(streets)}`,
        city: location.city,
        state: location.state,
        zipCode: location.zip,
        country: "USA"
      },
      licenseNumber: `${location.state}-${["ROF", "WTR", "GEN", "FIR", "ELC", "PLB"][randomInt(0, 5)]}-2024-${String(i + 1).padStart(3, '0')}`,
      insuranceCertificate: `INS-CERT-2024-${String(i + 1).padStart(3, '0')}`,
      specialties: randomElement(specialtiesList),
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      isPreferred: Math.random() > 0.6,
      isActive: Math.random() > 0.1
    });
  }
  return contractors;
}

// Generate Claims (125 total: 100 regular + 25 storm/wind)
function generateClaims() {
  const claims = [];
  const now = new Date();
  
  // Historical claims: 6 months back to 30 days back
  const historicalStartDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000); // 6 months ago
  const historicalEndDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  // Generate 100 regular claims with historical dates
  for (let i = 0; i < 100; i++) {
    const lossDate = randomDate(historicalStartDate, historicalEndDate);
    const reportDate = new Date(lossDate.getTime() + randomInt(1, 48) * 60 * 60 * 1000); // 1-48 hours after loss
    const location = randomElement(cities);
    const damage = randomElement(damageTypes);
    const severity = randomElement(damage.severity);
    
    claims.push({
      id: String(i + 1),
      claimNumber: `CN2025${String(4990 + i).padStart(5, '0')}`,
      policyNumber: `POL-HO-2025-${String(i + 1).padStart(3, '0')}`,
      policyHolderName: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
      policyHolderEmail: `policyholder${i + 1}@email.com`,
      property: `${randomInt(100, 9999)} ${randomElement(streets)}, ${location.city}, ${location.state} ${location.zip}`,
      dateOfLoss: formatDate(lossDate),
      dateReported: formatDate(reportDate),
      status: randomElement(claimStatuses),
      damageTypes: [
        `${damage.primary} - ${severity} severity`,
        damage.secondary
      ],
      description: `${damage.primary} to property requiring assessment and repair`,
      estimatedLoss: randomInt(2000, 50000),
      adjusterAssigned: `adj-${String(randomInt(1, 10)).padStart(3, '0')}`,
      notes: [
        "Initial report filed",
        Math.random() > 0.5 ? "Photos uploaded" : "Awaiting documentation",
        Math.random() > 0.7 ? "Urgent priority" : "Standard processing"
      ].filter(() => Math.random() > 0.3),
      createdAt: formatDate(reportDate),
      updatedAt: formatDate(new Date(reportDate.getTime() + randomInt(1, 168) * 60 * 60 * 1000))
    });
  }

  // Generate 25 NEW storm/wind damage claims (last 24-72 hours)
  const stormDamageTypes = [
    { primary: "Roof damage", severity: ["moderate", "severe"], secondary: "Storm damage" },
    { primary: "Wind damage", severity: ["moderate", "severe"], secondary: "Storm damage" },
    { primary: "Hail damage", severity: ["minor", "moderate", "severe"], secondary: "Storm damage" }
  ];

  // Focus on Seattle area for storm scenario
  const seattleAreaCities = cities.filter(c => c.state === "WA");
  const seattleCity = cities.find(c => c.city === "Seattle" && c.state === "WA");

  for (let i = 100; i < 125; i++) {
    // Special handling for CN202505096 (i=106)
    const isSpecialClaim = (4990 + i === 5096);
    
    // First 10 storm claims (i=100-109) are in Seattle within last 24 hours
    const isRecentSeattleStorm = (i >= 100 && i <= 109);
    
    // Loss dates: special claim gets 1-12 hours, first 10 get 1-24 hours, rest get 1-72 hours
    let hoursAgo;
    if (isSpecialClaim) {
      hoursAgo = randomInt(1, 12);
    } else if (isRecentSeattleStorm) {
      hoursAgo = randomInt(1, 24);
    } else {
      hoursAgo = randomInt(1, 72);
    }
    
    const lossDate = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    const reportDate = new Date(lossDate.getTime() + randomInt(1, 6) * 60 * 60 * 1000); // 1-6 hours after loss
    const location = (isSpecialClaim || isRecentSeattleStorm) ? seattleCity : randomElement(seattleAreaCities);
    const damage = isSpecialClaim 
      ? { primary: "Roof damage", severity: ["severe"], secondary: "Storm damage" }
      : randomElement(stormDamageTypes);
    const severity = randomElement(damage.severity);
    
    claims.push({
      id: String(i + 1),
      claimNumber: `CN2025${String(4990 + i).padStart(5, '0')}`,
      policyNumber: `POL-HO-2025-${String(i + 1).padStart(3, '0')}`,
      policyHolderName: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
      policyHolderEmail: `policyholder${i + 1}@email.com`,
      property: `${randomInt(100, 9999)} ${randomElement(streets)}, ${location.city}, ${location.state} ${location.zip}`,
      dateOfLoss: formatDate(lossDate),
      dateReported: formatDate(reportDate),
      status: randomElement([
        "Open - Claim is under investigation",
        "Under Investigation - Claim is being reviewed by adjusters",
        "Pending Documentation - Awaiting additional information"
      ]), // Recent claims are still open
      damageTypes: [
        `${damage.primary} - ${severity} severity`,
        damage.secondary
      ],
      description: `Emergency: ${damage.primary} from recent storm event requiring immediate assessment`,
      estimatedLoss: randomInt(15000, 75000), // Higher losses for storm damage
      adjusterAssigned: `adj-${String(randomInt(1, 10)).padStart(3, '0')}`,
      notes: [
        "Initial report filed",
        "Photos uploaded",
        severity === "severe" ? "URGENT - Emergency response required" : "High priority storm claim",
        `Reported ${Math.floor(hoursAgo)} hours after incident`
      ],
      createdAt: formatDate(reportDate),
      updatedAt: formatDate(new Date(Math.max(reportDate.getTime(), now.getTime() - 2 * 60 * 60 * 1000)))
    });
  }
  
  return claims;
}

// Generate Inspections based on claims
function generateInspections(claims, inspectors) {
  const inspections = [];
  let inspectionCounter = 1;

  claims.forEach((claim) => {
    // 0, 1, 2, 3, or 4 inspections per claim
    const numInspections = randomInt(0, 4);
    
    for (let i = 0; i < numInspections; i++) {
      const reportDate = new Date(claim.dateReported);
      const scheduledDate = new Date(reportDate.getTime() + randomInt(24, 240) * 60 * 60 * 1000);
      const isCompleted = Math.random() > 0.3;
      const completedDate = isCompleted ? new Date(scheduledDate.getTime() + randomInt(2, 10) * 60 * 60 * 1000) : null;
      
      const inspection = {
        id: `insp-${String(inspectionCounter).padStart(3, '0')}`,
        claimId: claim.id,
        claimNumber: claim.claimNumber,
        taskType: i === 0 ? "initial" : randomElement(taskTypes),
        priority: randomElement(priorities),
        status: isCompleted ? "completed" : randomElement(inspectionStatuses.filter(s => s !== "completed")),
        scheduledDate: formatDate(scheduledDate),
        inspectorId: randomElement(inspectors).id,
        property: claim.property,
        instructions: `Assess ${claim.damageTypes[0]} and document findings`,
        photos: isCompleted ? [
          `https://github.com/rabwill/zava-assets/blob/main/IMG-${String(randomInt(1, 20)).padStart(2, '0')}.png?raw=true`
        ] : [],
        findings: isCompleted ? `Inspection completed. ${claim.damageTypes[0]} confirmed. ${randomElement([
          "Immediate repairs recommended.",
          "Temporary stabilization required.",
          "Further assessment needed.",
          "Damage within policy coverage.",
          "Multiple areas affected."
        ])}` : "",
        recommendedActions: isCompleted ? [
          randomElement(["Emergency repairs required", "Standard repair procedures", "Full replacement recommended"]),
          randomElement(["Document all damages", "Obtain multiple quotes", "Coordinate with adjuster"])
        ].filter(() => Math.random() > 0.3) : [],
        flaggedIssues: isCompleted && Math.random() > 0.6 ? [
          randomElement([
            "Safety hazard present",
            "Secondary damage detected",
            "Potential code violations",
            "Additional specialist required"
          ])
        ] : [],
        createdAt: formatDate(reportDate),
        updatedAt: formatDate(completedDate || scheduledDate)
      };

      if (completedDate) {
        inspection.completedDate = formatDate(completedDate);
      }

      inspections.push(inspection);
      inspectionCounter++;
    }
  });

  return inspections;
}

// Generate Purchase Orders for claims with completed inspections
function generatePurchaseOrders(claims, inspections, contractors) {
  const purchaseOrders = [];
  let poCounter = 1;

  // Group inspections by claim
  const inspectionsByClaim = {};
  inspections.forEach(insp => {
    if (!inspectionsByClaim[insp.claimId]) {
      inspectionsByClaim[insp.claimId] = [];
    }
    inspectionsByClaim[insp.claimId].push(insp);
  });

  // Generate POs for claims with completed inspections (about 50% of them)
  claims.forEach(claim => {
    const claimInspections = inspectionsByClaim[claim.id] || [];
    const completedInspections = claimInspections.filter(i => i.status === "completed");
    
    if (completedInspections.length > 0 && Math.random() > 0.5) {
      const contractor = randomElement(contractors.filter(c => c.isActive));
      const createdDate = new Date(Math.max(...completedInspections.map(i => new Date(i.completedDate))));
      const approvedDate = Math.random() > 0.4 ? new Date(createdDate.getTime() + randomInt(1, 72) * 60 * 60 * 1000) : null;
      
      // Generate line items based on damage type
      const lineItems = [];
      const numLineItems = randomInt(2, 5);
      let lineItemCounter = 1;
      
      for (let i = 0; i < numLineItems; i++) {
        const categories = ["materials", "labor", "equipment"];
        const category = randomElement(categories);
        const quantity = randomInt(1, 20);
        const unitPrice = randomInt(50, 500);
        
        lineItems.push({
          id: `li-${String(poCounter * 10 + lineItemCounter).padStart(3, '0')}`,
          description: randomElement([
            "Roofing materials and supplies",
            "Labor and installation services",
            "Equipment rental and operation",
            "Emergency repair services",
            "Structural repairs and reinforcement",
            "Water damage restoration",
            "Debris removal and cleanup",
            "Temporary protective measures"
          ]),
          quantity,
          unitPrice,
          totalPrice: quantity * unitPrice,
          category
        });
        lineItemCounter++;
      }
      
      const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const tax = subtotal * 0.09; // 9% tax
      const total = subtotal + tax;
      
      const po = {
        id: `po-${String(poCounter).padStart(3, '0')}`,
        poNumber: `PO-2025-${String(poCounter).padStart(3, '0')}`,
        claimId: claim.id,
        claimNumber: claim.claimNumber,
        contractorId: contractor.id,
        workDescription: `${claim.damageTypes[0]} repair and restoration services`,
        lineItems,
        subtotal: Math.round(subtotal * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100,
        status: approvedDate ? randomElement(["approved", "in-progress", "completed"]) : "pending",
        createdDate: formatDate(createdDate),
        notes: [
          approvedDate ? "Approved for repair work" : "Pending approval from adjuster",
          randomElement(["Work to begin immediately upon approval", "Contractor notified", "Materials ordered"])
        ].filter(() => Math.random() > 0.4)
      };
      
      if (approvedDate) {
        po.approvedDate = formatDate(approvedDate);
        po.approvedBy = claim.adjusterAssigned;
      }
      
      purchaseOrders.push(po);
      poCounter++;
    }
  });

  return purchaseOrders;
}

// Main execution
console.log('Generating comprehensive insurance data...\n');

const inspectors = generateInspectors();
console.log(`✓ Generated ${inspectors.length} inspectors`);

const contractors = generateContractors();
console.log(`✓ Generated ${contractors.length} contractors`);

const claims = generateClaims();
console.log(`✓ Generated ${claims.length} claims`);

const inspections = generateInspections(claims, inspectors);
console.log(`✓ Generated ${inspections.length} inspections`);

const purchaseOrders = generatePurchaseOrders(claims, inspections, contractors);
console.log(`✓ Generated ${purchaseOrders.length} purchase orders\n`);

// Write files
const dataDir = __dirname;

fs.writeFileSync(path.join(dataDir, 'inspectors.json'), JSON.stringify(inspectors, null, 2));
console.log('✓ Written inspectors.json');

fs.writeFileSync(path.join(dataDir, 'contractors.json'), JSON.stringify(contractors, null, 2));
console.log('✓ Written contractors.json');

fs.writeFileSync(path.join(dataDir, 'claims.json'), JSON.stringify(claims, null, 2));
console.log('✓ Written claims.json');

fs.writeFileSync(path.join(dataDir, 'inspections.json'), JSON.stringify(inspections, null, 2));
console.log('✓ Written inspections.json');

fs.writeFileSync(path.join(dataDir, 'purchaseOrders.json'), JSON.stringify(purchaseOrders, null, 2));
console.log('✓ Written purchaseOrders.json');

console.log('\n✅ Data generation complete!');
console.log('\nSummary:');
console.log(`  - ${claims.length} claims`);
console.log(`  - ${inspections.length} inspections (${inspections.filter(i => i.status === 'completed').length} completed)`);
console.log(`  - ${contractors.length} contractors`);
console.log(`  - ${inspectors.length} inspectors`);
console.log(`  - ${purchaseOrders.length} purchase orders`);
