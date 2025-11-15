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
    enum: ['R1', 'R2', 'R3', 'C1', 'C2', 'I1', 'I2', 'Mixed', 'Special', 'All']
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
