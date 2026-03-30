// Reset admin user with correct credentials from .env
require('dotenv').config();
const mongoose = require('mongoose');
const { Admin } = require('../models');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio')
  .then(async () => {
    console.log('📦 Connected to MongoDB');
    
    // Delete existing admin
    await Admin.deleteMany({});
    console.log('🗑️  Cleared existing admin users');
    
    // Create new admin with .env credentials
    const admin = await Admin.create({
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      name: 'Admin'
    });
    
    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔐 Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
