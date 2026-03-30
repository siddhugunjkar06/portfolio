// Detailed project check
require('dotenv').config();
const mongoose = require('mongoose');
const { Project } = require('../models');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('📦 Connected to MongoDB\n');
    
    const projects = await Project.find({});
    
    console.log(`📁 Total Projects: ${projects.length}\n`);
    projects.forEach((p, i) => {
      console.log(`${i + 1}. ${p.title}`);
      console.log(`   ID: ${p._id}`);
      console.log(`   Status: ${p.status}`);
      console.log(`   Image: ${p.image ? '✅ ' + p.image.substring(0, 50) + '...' : '❌ NO IMAGE'}`);
      console.log(`   Category: ${p.category}`);
      console.log(`   Created: ${p.createdAt}`);
      console.log('');
    });
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
