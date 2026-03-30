// Quick script to clear projects collection and reseed
require('dotenv').config();
const mongoose = require('mongoose');
const { Project } = require('../models');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio')
  .then(async () => {
    console.log('📦 Connected to MongoDB');
    
    // Delete all projects
    await Project.deleteMany({});
    console.log('🗑️  Cleared all projects');
    
    // Reseed with images
    await Project.insertMany([
      {
        title: 'NovaTrade Platform',
        shortDesc: 'Real-time trading dashboard with AI-driven analytics',
        description: 'A comprehensive trading platform built with React, Node.js, and WebSocket technology. Features real-time market data, portfolio tracking, AI-powered trading signals, and advanced charting capabilities.',
        category: 'web',
        technologies: ['React', 'Node.js', 'WebSocket', 'MongoDB', 'Redis', 'D3.js'],
        image: 'https://images.unsplash.com/photo-1611632622046-f686de0ad433?w=500&h=300&fit=crop',
        liveUrl: 'https://example.com',
        featured: true, order: 1
      },
      {
        title: 'PulseHealth App',
        shortDesc: 'Healthcare management system for clinics',
        description: 'Full-stack healthcare platform enabling appointment booking, patient records, telemedicine sessions, and prescription management. HIPAA compliant architecture.',
        category: 'web',
        technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Twilio'],
        image: 'https://images.unsplash.com/photo-1576091160550-112173e7d7cb?w=500&h=300&fit=crop',
        liveUrl: 'https://example.com',
        featured: true, order: 2
      },
      {
        title: 'EcoShop E-Commerce',
        shortDesc: 'Sustainable products marketplace with AR try-on',
        description: 'Modern e-commerce platform for eco-friendly products featuring AR product visualization, subscription management, carbon footprint tracking, and multi-vendor support.',
        category: 'ecommerce',
        technologies: ['Vue.js', 'Express', 'MongoDB', 'Stripe', 'Three.js', 'AWS'],
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=300&fit=crop',
        liveUrl: 'https://example.com',
        featured: true, order: 3
      },
      {
        title: 'TaskFlow SaaS',
        shortDesc: 'Team project management & collaboration tool',
        description: 'Project management platform with real-time collaboration, Kanban boards, time tracking, invoicing, and team analytics. Supports 10,000+ concurrent users.',
        category: 'web',
        technologies: ['React', 'GraphQL', 'Node.js', 'PostgreSQL', 'Socket.io'],
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
        featured: false, order: 4
      },
      {
        title: 'CityGuide Mobile',
        shortDesc: 'AI-powered travel companion app',
        description: 'React Native travel app with offline maps, AI tour recommendations, AR landmark detection, social sharing, and real-time crowd monitoring.',
        category: 'mobile',
        technologies: ['React Native', 'Expo', 'Python', 'TensorFlow', 'Firebase'],
        image: 'https://images.unsplash.com/photo-1512941691920-25bda36dc643?w=500&h=300&fit=crop',
        featured: false, order: 5
      },
      {
        title: 'BrandForge Studio',
        shortDesc: 'Complete brand identity design system',
        description: 'Full brand identity system including logo design, design system creation, UI component library, and brand guidelines for a Fortune 500 company.',
        category: 'design',
        technologies: ['Figma', 'Adobe CC', 'Storybook', 'CSS', 'React'],
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
        featured: false, order: 6
      }
    ]);
    
    console.log('✅ Projects reseeded with images!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
