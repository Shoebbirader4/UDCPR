import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  projectName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  district: {
    type: String
  },
  plotArea: {
    type: Number,
    required: true
  },
  zone: {
    type: String,
    enum: ['Residential', 'Commercial', 'Industrial', 'Mixed', 'Special']
  },
  landUse: {
    type: String
  },
  // Project details
  proposedFSI: Number,
  permissibleFSI: Number,
  builtUpArea: Number,
  floors: Number,
  dwellingUnits: Number,
  
  // Compliance status
  complianceStatus: {
    type: String,
    enum: ['pending', 'pass', 'fail', 'under-review'],
    default: 'pending'
  },
  violations: [{
    type: String,
    severity: String,
    message: String
  }],
  
  // Files
  drawings: [{
    filename: String,
    path: String,
    uploadedAt: Date
  }],
  reports: [{
    filename: String,
    path: String,
    generatedAt: Date
  }],
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  notes: String
});

// Update timestamp on save
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for faster queries
projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ complianceStatus: 1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
