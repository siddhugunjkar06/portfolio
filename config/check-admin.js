// Check admin user in database
require('dotenv').config();
const mongoose = require('mongoose');
const { Admin } = require('../models');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('📦 Connected to MongoDB\n');
    
    const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (admin) {
      console.log('✅ Admin user found!');
      console.log(`📧 Email: ${admin.email}`);
      console.log(`🔐 Password (hashed): ${admin.password.substring(0, 30)}...`);
      
      // Test password
      const isMatch = await admin.comparePassword(process.env.ADMIN_PASSWORD);
      console.log(`\n🔑 Password Test: ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
    } else {
      console.log('❌ Admin user NOT found with email:', process.env.ADMIN_EMAIL);
      console.log('\nCreating admin with current .env credentials...\n');
      
      const newAdmin = await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        name: 'Admin'
      });
      
      console.log('✅ Admin created!');
      console.log(`📧 Email: ${newAdmin.email}`);
      console.log(`🔐 Password: ${process.env.ADMIN_PASSWORD}`);
    }
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
