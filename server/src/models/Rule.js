import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema({
  chapter: {
    type: String,
    required: true,
    index: true
  },
  section: {
    type: String,
    required: true,
    index: true
  },
  clause: {
    type: String,
    required: true
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String
  },
  summary: {
    type: String,
    required: true
  },
  fullText: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: [
      'FSI',
      'Setback',
      'Height',
      'Parking',
      'Heritage',
      'TDR',
      'Amenity',
      'Environmental',
      'Safety',
      'Accessibility',
      'CRZ',
      'TOD',
      'Affordable Housing',
      'Mixed Use',
      'Special Buildings',
      'Land Use',
      'Zoning',
      'Infrastructure',
      'Social Infrastructure',
      'Redevelopment',
      'Regularization',
      'Building Requirements',
      'Structural',
      'Fire Safety',
      'Procedures',
      'Penalties',
      'General'
    ],
    index: true
  },
  subcategory: {
    type: String,
    index: true
  },
  applicableZones: [{
    type: String,
    enum: ['R1', 'R2', 'R3', 'R4', 'R-1', 'R-2', 'R-3', 'R-4',
           'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C-1', 'C-2', 'C-3', 'C-4', 'C-5', 'C-6', 'C-7', 'C-8',
           'I1', 'I2', 'I3', 'I-1', 'I-2', 'I-3',
           'M1', 'M2', 'M3', 'M-1', 'M-2', 'M-3',
           'Mixed', 'Special', 'All']
  }],
  applicableDistricts: [{
    type: String
  }],
  isGeneral: {
    type: Boolean,
    default: true // General rules apply to all districts
  },
  effectiveDate: {
    type: Date,
    default: new Date('2020-01-01')
  },
  amendments: [{
    date: Date,
    description: String,
    reference: String
  }],
  relatedRules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rule'
  }],
  tags: [String],
  status: {
    type: String,
    enum: ['Active', 'Superseded', 'Amended', 'Repealed'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Text index for search
ruleSchema.index({ 
  summary: 'text', 
  fullText: 'text', 
  title: 'text',
  tags: 'text'
});

// Compound indexes for common queries
ruleSchema.index({ chapter: 1, section: 1, clause: 1 });
ruleSchema.index({ category: 1, status: 1 });
ruleSchema.index({ isGeneral: 1, status: 1 });

const Rule = mongoose.model('Rule', ruleSchema);

export default Rule;
