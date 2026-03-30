// Check what's saved in projects
require('dotenv').config();
const mongoose = require('mongoose');
const { Project } = require('../models');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('📦 Connected to MongoDB\n');
    
    const projects = await Project.find({}, { title: 1, image: 1, _id: 1 }).limit(5);
    
    console.log('📁 Projects in Database:\n');
    projects.forEach((p, i) => {
      console.log(`${i + 1}. ${p.title}`);
      console.log(`   ID: ${p._id}`);
      console.log(`   Image: ${p.image || 'NO IMAGE'}`);
      console.log('');
    });
    
    if (projects.length === 0) {
      console.log('❌ No projects found in database!');
    }
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
