const express = require('express');
const router = express.Router();
const { Project, Service, Testimonial, Skill, Contact } = require('../models');

router.get('/projects', async (req, res) => {
  const { category } = req.query;
  const filter = { status: 'active' };
  if (category && category !== 'all') filter.category = category;
  const projects = await Project.find(filter).sort('order');
  res.json(projects);
});

router.get('/stats', async (req, res) => {
  const [projects, contacts, services] = await Promise.all([
    Project.countDocuments({ status: 'active' }),
    Contact.countDocuments(),
    Service.countDocuments()
  ]);
  res.json({ projects, contacts, services });
});

module.exports = router;
