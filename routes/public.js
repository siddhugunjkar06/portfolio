const express = require('express');
const router = express.Router();
const { Project, Service, Testimonial, Skill, Settings, Contact, Blog } = require('../models');

// Helper to get settings as object
async function getSettings() {
  const all = await Settings.find();
  return all.reduce((acc, s) => { acc[s.key] = s.value; return acc; }, {});
}

// HOME PAGE
router.get('/', async (req, res) => {
  try {
    const [settings, featuredProjects, services, testimonials, skills] = await Promise.all([
      getSettings(),
      Project.find({ featured: true, status: 'active' }).sort('order').limit(6),
      Service.find().sort('order').limit(6),
      Testimonial.find({ featured: true }).sort('order').limit(5),
      Skill.find().sort('order')
    ]);
    res.render('index', { settings, featuredProjects, services, testimonials, skills, page: 'home' });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Server error' });
  }
});

// PROJECTS PAGE
router.get('/projects', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { status: 'active' };
    if (category && category !== 'all') filter.category = category;
    const [settings, projects] = await Promise.all([
      getSettings(),
      Project.find(filter).sort('order')
    ]);
    res.render('projects', { settings, projects, activeCategory: category || 'all', page: 'projects' });
  } catch (err) {
    res.status(500).render('error', { message: 'Server error' });
  }
});

// PROJECT DETAIL
router.get('/projects/:id', async (req, res) => {
  try {
    const [settings, project, relatedProjects] = await Promise.all([
      getSettings(),
      Project.findById(req.params.id),
      Project.find({ status: 'active' }).limit(3)
    ]);
    if (!project) return res.redirect('/projects');
    res.render('project-detail', { settings, project, relatedProjects, page: 'projects' });
  } catch (err) {
    res.redirect('/projects');
  }
});

// SERVICES PAGE
router.get('/services', async (req, res) => {
  try {
    const [settings, services] = await Promise.all([
      getSettings(),
      Service.find().sort('order')
    ]);
    res.render('services', { settings, services, page: 'services' });
  } catch (err) {
    res.status(500).render('error', { message: 'Server error' });
  }
});

// BLOG
router.get('/blog', async (req, res) => {
  try {
    const [settings, posts] = await Promise.all([
      getSettings(),
      Blog.find({ status: 'published' }).sort('-createdAt')
    ]);
    res.render('blog', { settings, posts, page: 'blog' });
  } catch (err) {
    res.status(500).render('error', { message: 'Server error' });
  }
});

// CONTACT PAGE
router.get('/contact', async (req, res) => {
  try {
    const settings = await getSettings();
    res.render('contact', { settings, page: 'contact' });
  } catch (err) {
    res.status(500).render('error', { message: 'Server error' });
  }
});

// CONTACT SUBMIT
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message, budget } = req.body;
    if (!name || !email || !subject || !message) {
      return res.json({ success: false, message: 'All fields required.' });
    }
    await Contact.create({ name, email, subject, message, budget, ipAddress: req.ip });
    res.json({ success: true, message: 'Message sent successfully! I will get back to you within 24 hours.' });
  } catch (err) {
    res.json({ success: false, message: 'Server error, please try again.' });
  }
});

module.exports = router;
