const express = require('express');
const router = express.Router();
const { Admin, Project, Service, Contact, Testimonial, Skill, Settings, Blog } = require('../models');
const { isAdmin, isGuest } = require('../middleware/auth');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Cloudinary Multer setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

async function getSettings() {
  const all = await Settings.find();
  return all.reduce((acc, s) => { acc[s.key] = s.value; return acc; }, {});
}

// ─── AUTH ────────────────────────────────────────────────────────────────────
router.get('/login', isGuest, (req, res) => res.render('admin/login', { page: 'login' }));

router.post('/login', isGuest, async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/admin/login');
    }
    req.session.isAdmin = true;
    req.session.adminId = admin._id;
    req.session.adminName = admin.name;
    req.flash('success', `Welcome back, ${admin.name}!`);
    res.redirect('/admin/dashboard');
  } catch (err) {
    req.flash('error', 'Login failed.');
    res.redirect('/admin/login');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    const [projects, services, contacts, testimonials, unreadContacts, settings] = await Promise.all([
      Project.countDocuments(),
      Service.countDocuments(),
      Contact.countDocuments(),
      Testimonial.countDocuments(),
      Contact.countDocuments({ status: 'unread' }),
      getSettings()
    ]);
    const recentContacts = await Contact.find().sort('-createdAt').limit(5);
    res.render('admin/dashboard', {
      page: 'dashboard', stats: { projects, services, contacts, testimonials, unreadContacts },
      recentContacts, settings, adminName: req.session.adminName
    });
  } catch (err) {
    res.render('admin/dashboard', { page: 'dashboard', stats: {}, recentContacts: [], settings: {}, adminName: 'Admin' });
  }
});

// ─── PROJECTS CRUD ───────────────────────────────────────────────────────────
router.get('/projects', isAdmin, async (req, res) => {
  const projects = await Project.find().sort('order');
  const settings = await getSettings();
  res.render('admin/projects', { page: 'projects', projects, settings , adminName: req.session.adminName || 'Admin' });
});

router.get('/projects/new', isAdmin, async (req, res) => {
  const settings = await getSettings();
  res.render('admin/project-form', { page: 'projects', project: null, settings , adminName: req.session.adminName || 'Admin' });
});

router.post('/projects', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = req.file.secure_url;
    if (typeof data.technologies === 'string') data.technologies = data.technologies.split(',').map(t => t.trim()).filter(Boolean);
    data.featured = data.featured === 'on';
    await Project.create(data);
    req.flash('success', 'Project created!');
    res.redirect('/admin/projects');
  } catch (err) {
    req.flash('error', 'Error creating project.');
    res.redirect('/admin/projects/new');
  }
});

router.get('/projects/:id/edit', isAdmin, async (req, res) => {
  const [project, settings] = await Promise.all([Project.findById(req.params.id), getSettings()]);
  res.render('admin/project-form', { page: 'projects', project, settings , adminName: req.session.adminName || 'Admin' });
});

router.put('/projects/:id', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = req.file.secure_url;
    if (typeof data.technologies === 'string') data.technologies = data.technologies.split(',').map(t => t.trim()).filter(Boolean);
    data.featured = data.featured === 'on';
    await Project.findByIdAndUpdate(req.params.id, data);
    req.flash('success', 'Project updated!');
    res.redirect('/admin/projects');
  } catch (err) {
    req.flash('error', 'Error updating project.');
    res.redirect('/admin/projects');
  }
});

router.delete('/projects/:id', isAdmin, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  req.flash('success', 'Project deleted.');
  res.redirect('/admin/projects');
});

// ─── SERVICES CRUD ───────────────────────────────────────────────────────────
router.get('/services', isAdmin, async (req, res) => {
  const [services, settings] = await Promise.all([Service.find().sort('order'), getSettings()]);
  res.render('admin/services', { page: 'services', services, settings , adminName: req.session.adminName || 'Admin' });
});

router.get('/services/new', isAdmin, async (req, res) => {
  const settings = await getSettings();
  res.render('admin/service-form', { page: 'services', service: null, settings , adminName: req.session.adminName || 'Admin' });
});

router.post('/services', isAdmin, async (req, res) => {
  try {
    const data = req.body;
    if (typeof data.features === 'string') data.features = data.features.split('\n').map(f => f.trim()).filter(Boolean);
    data.featured = data.featured === 'on';
    await Service.create(data);
    req.flash('success', 'Service created!');
    res.redirect('/admin/services');
  } catch (err) {
    req.flash('error', 'Error creating service.');
    res.redirect('/admin/services/new');
  }
});

router.get('/services/:id/edit', isAdmin, async (req, res) => {
  const [service, settings] = await Promise.all([Service.findById(req.params.id), getSettings()]);
  res.render('admin/service-form', { page: 'services', service, settings , adminName: req.session.adminName || 'Admin' });
});

router.put('/services/:id', isAdmin, async (req, res) => {
  try {
    const data = req.body;
    if (typeof data.features === 'string') data.features = data.features.split('\n').map(f => f.trim()).filter(Boolean);
    data.featured = data.featured === 'on';
    await Service.findByIdAndUpdate(req.params.id, data);
    req.flash('success', 'Service updated!');
    res.redirect('/admin/services');
  } catch (err) {
    req.flash('error', 'Error updating service.');
    res.redirect('/admin/services');
  }
});

router.delete('/services/:id', isAdmin, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  req.flash('success', 'Service deleted.');
  res.redirect('/admin/services');
});

// ─── CONTACTS ────────────────────────────────────────────────────────────────
router.get('/contacts', isAdmin, async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status && status !== 'all') filter.status = status;
  const [contacts, settings] = await Promise.all([Contact.find(filter).sort('-createdAt'), getSettings()]);
  res.render('admin/contacts', { page: 'contacts', contacts, settings, activeStatus: status || 'all' , adminName: req.session.adminName || 'Admin' });
});

router.put('/contacts/:id/status', isAdmin, async (req, res) => {
  await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status });
  req.flash('success', 'Status updated!');
  res.redirect('/admin/contacts');
});

router.delete('/contacts/:id', isAdmin, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  req.flash('success', 'Message deleted.');
  res.redirect('/admin/contacts');
});

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
router.get('/testimonials', isAdmin, async (req, res) => {
  const [testimonials, settings] = await Promise.all([Testimonial.find().sort('order'), getSettings()]);
  res.render('admin/testimonials', { page: 'testimonials', testimonials, settings , adminName: req.session.adminName || 'Admin' });
});

router.post('/testimonials', isAdmin, upload.single('avatar'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.avatar = req.file.secure_url;
    data.featured = data.featured === 'on';
    await Testimonial.create(data);
    req.flash('success', 'Testimonial added!');
    res.redirect('/admin/testimonials');
  } catch (err) {
    req.flash('error', 'Error adding testimonial.');
    res.redirect('/admin/testimonials');
  }
});

router.delete('/testimonials/:id', isAdmin, async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  req.flash('success', 'Testimonial deleted.');
  res.redirect('/admin/testimonials');
});

// ─── SKILLS ──────────────────────────────────────────────────────────────────
router.get('/skills', isAdmin, async (req, res) => {
  const [skills, settings] = await Promise.all([Skill.find().sort('order'), getSettings()]);
  res.render('admin/skills', { page: 'skills', skills, settings , adminName: req.session.adminName || 'Admin' });
});

router.post('/skills', isAdmin, async (req, res) => {
  await Skill.create(req.body);
  req.flash('success', 'Skill added!');
  res.redirect('/admin/skills');
});

router.delete('/skills/:id', isAdmin, async (req, res) => {
  await Skill.findByIdAndDelete(req.params.id);
  req.flash('success', 'Skill deleted.');
  res.redirect('/admin/skills');
});

// ─── SETTINGS ────────────────────────────────────────────────────────────────
router.get('/settings', isAdmin, async (req, res) => {
  const settings = await getSettings();
  res.render('admin/settings', { page: 'settings', settings , adminName: req.session.adminName || 'Admin' });
});

router.post('/settings', isAdmin, async (req, res) => {
  try {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      await Settings.findOneAndUpdate({ key }, { value }, { upsert: true });
    }
    req.flash('success', 'Settings saved!');
    res.redirect('/admin/settings');
  } catch (err) {
    req.flash('error', 'Error saving settings.');
    res.redirect('/admin/settings');
  }
});

// Change Password
router.post('/change-password', isAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.session.adminId);
    if (!admin || !(await admin.comparePassword(currentPassword))) {
      req.flash('error', 'Current password is incorrect.');
      return res.redirect('/admin/settings');
    }
    admin.password = newPassword;
    await admin.save();
    req.flash('success', 'Password changed successfully!');
    res.redirect('/admin/settings');
  } catch (err) {
    req.flash('error', 'Error changing password.');
    res.redirect('/admin/settings');
  }
});

// ─── BLOG ────────────────────────────────────────────────────────────────────
router.get('/blog', isAdmin, async (req, res) => {
  const [posts, settings] = await Promise.all([Blog.find().sort('-createdAt'), getSettings()]);
  res.render('admin/blog', { page: 'blog', posts, settings , adminName: req.session.adminName || 'Admin' });
});

router.get('/blog/new', isAdmin, async (req, res) => {
  const settings = await getSettings();
  res.render('admin/blog-form', { page: 'blog', post: null, settings , adminName: req.session.adminName || 'Admin' });
});

router.post('/blog', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = req.file.secure_url;
    if (typeof data.tags === 'string') data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    await Blog.create(data);
    req.flash('success', 'Post created!');
    res.redirect('/admin/blog');
  } catch (err) {
    req.flash('error', 'Error creating post.');
    res.redirect('/admin/blog/new');
  }
});

router.delete('/blog/:id', isAdmin, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  req.flash('success', 'Post deleted.');
  res.redirect('/admin/blog');
});

module.exports = router;
