const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── Admin Model ────────────────────────────────────────────────────────────
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Admin' }
}, { timestamps: true });

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// ─── Project Model ───────────────────────────────────────────────────────────
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  shortDesc: { type: String, required: true },
  category: { type: String, enum: ['web', 'mobile', 'design', 'ecommerce', 'other'], default: 'web' },
  technologies: [String],
  image: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'draft'], default: 'active' }
}, { timestamps: true });

// ─── Service Model ───────────────────────────────────────────────────────────
const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: '💻' },
  features: [String],
  price: { type: String, default: '' },
  order: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

// ─── Contact/Message Model ───────────────────────────────────────────────────
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  budget: { type: String, default: '' },
  status: { type: String, enum: ['unread', 'read', 'replied', 'archived'], default: 'unread' },
  ipAddress: { type: String, default: '' }
}, { timestamps: true });

// ─── Testimonial Model ───────────────────────────────────────────────────────
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, default: '' },
  message: { type: String, required: true },
  avatar: { type: String, default: '' },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  featured: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// ─── Skill Model ─────────────────────────────────────────────────────────────
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, min: 0, max: 100, default: 80 },
  category: { type: String, default: 'frontend' },
  icon: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// ─── Settings Model ──────────────────────────────────────────────────────────
const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed
}, { timestamps: true });

// ─── Blog Post Model ─────────────────────────────────────────────────────────
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, default: '' },
  tags: [String],
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = {
  Admin: mongoose.model('Admin', adminSchema),
  Project: mongoose.model('Project', projectSchema),
  Service: mongoose.model('Service', serviceSchema),
  Contact: mongoose.model('Contact', contactSchema),
  Testimonial: mongoose.model('Testimonial', testimonialSchema),
  Skill: mongoose.model('Skill', skillSchema),
  Settings: mongoose.model('Settings', settingsSchema),
  Blog: mongoose.model('Blog', blogSchema)
};
