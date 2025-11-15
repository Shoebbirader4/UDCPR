import mongoose from 'mongoose';

const districtRuleSchema = new mongoose.Schema({
  // Location Information
  district: { 
    type: String, 
    required: true,
    enum: [
      'Mumbai City', 'Mumbai Suburban', 'Thane', 'Palghar', 'Raigad', 'Ratnagiri', 'Sindhudurg',
      'Pune', 'Satara', 'Sangli', 'Kolhapur', 'Solapur',
      'Nashik', 'Dhule', 'Nandurbar', 'Jalgaon',
      'Aurangabad', 'Jalna', 'Beed', 'Latur', 'Osmanabad', 'Nanded', 'Parbhani', 'Hingoli',
      'Nagpur', 'Wardha', 'Bhandara', 'Gondia', 'Chandrapur', 'Gadchiroli',
      'Amravati', 'Akola', 'Yavatmal', 'Buldhana', 'Washim'
    ]
  },
  region: {
    type: String,
    enum: ['Konkan', 'Pune', 'Nashik', 'Aurangabad', 'Amravati', 'Nagpur']
  },
  planningAuthority: String, // e.g., "MMRDA", "PMRDA", "NMC"
  
  // Rule Classification
  chapter: { type: String, required: true },
  section: { type: String, required: true },
  clause: { type: String, required: true },
  subClause: String,
  
  // Rule Content
  summary: { type: String, required: true },
  fullText: { type: String, required: true },
  
  // Categorization
  category: { 
    type: String, 
    required: true,
    enum: [
      'FSI', 'Setback', 'Height', 'Parking', 'Heritage', 'TDR', 
      'Amenity', 'Environmental', 'Safety', 'Accessibility', 
      'CRZ', 'TOD', 'Affordable Housing', 'Mixed Use', 'Special Buildings',
      'Land Use', 'Zoning', 'Infrastructure', 'Social Infrastructure', 
      'Redevelopment', 'Regularization', 'General'
    ]
  },
  subCategory: String,
  
  // Applicability
  applicableZones: [String], // R1, R2, C1, C2, I1, etc.
  applicableAreas: [String], // Urban, Rural, Hill Station, Coastal, etc.
  municipalityType: {
    type: String,
    enum: ['Municipal Corporation', 'Municipal Council', 'Nagar Panchayat', 'Gram Panchayat', 'Mixed', 'All']
  },
  
  // Search & Discovery
  keywords: [String],
  tags: [String],
  
  // Variations & Exceptions
  isDistrictSpecific: { type: Boolean, default: false },
  isRegionalVariation: { type: Boolean, default: false },
  baseRuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'DistrictRule' },
  variations: String, // Description of how this varies from base rule
  
  // References
  officialReference: String, // GR number, notification number
  amendmentDate: Date,
  effectiveFrom: Date,
  supersedes: String, // Previous rule reference
  relatedClauses: [String],
  
  // Additional Information
  notes: String,
  examples: [String],
  calculations: Object, // For FSI, setback calculations
  tables: Object, // For parking requirements, etc.
  
  // Metadata
  status: {
    type: String,
    enum: ['Active', 'Superseded', 'Under Review', 'Proposed'],
    default: 'Active'
  },
  verifiedBy: String,
  verificationDate: Date,
  lastUpdated: Date,
  
}, { timestamps: true });

// Indexes for efficient querying
districtRuleSchema.index({ district: 1, category: 1 });
districtRuleSchema.index({ chapter: 1, section: 1, clause: 1 });
districtRuleSchema.index({ keywords: 'text', summary: 'text', fullText: 'text' });
districtRuleSchema.index({ applicableZones: 1 });
districtRuleSchema.index({ status: 1 });

export default mongoose.model('DistrictRule', districtRuleSchema);
