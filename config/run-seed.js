// Standalone seed script
require('dotenv').config();
const mongoose = require('mongoose');
const seedData = require('./seed');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio')
  .then(async () => {
    console.log('📦 Connected to MongoDB');
    console.log('🌱 Seeding database...\n');
    
    await seedData();
    
    console.log('\n✅ Seeding complete!');
    console.log(`📧 Admin Email: ${process.env.ADMIN_EMAIL || 'admin@portfolio.com'}`);
    console.log(`🔐 Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
