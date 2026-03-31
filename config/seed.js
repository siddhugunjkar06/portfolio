const { Admin, Project, Service, Testimonial, Skill, Settings } = require('../models');

module.exports = async function seedData() {
  try {
    // Seed Admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        name: 'Siddheshwar Gunjkar'
      });
      console.log('✅ Admin user seeded');
    }

    // Seed Settings
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.insertMany([
        { key: 'siteName', value: 'S G Devloper' },
        { key: 'tagline', value: 'Crafting Digital Experiences That Matter' },
        { key: 'email', value: 'hello@alexmorgandev.com' },
        { key: 'phone', value: '+1 (555) 123-4567' },
        { key: 'location', value: 'San Francisco, CA' },
        { key: 'bio', value: 'Full-stack developer with 8+ years of experience building scalable web applications and digital products that drive business growth.' },
        { key: 'github', value: 'https://github.com' },
        { key: 'linkedin', value: 'https://linkedin.com' },
        { key: 'instagram', value: 'https://instagram.com' },
        { key: 'yearsExperience', value: '8' },
        { key: 'projectsCompleted', value: '120+' },
        { key: 'happyClients', value: '85+' },
        { key: 'awards', value: '12' }
      ]);
      console.log('✅ Settings seeded');
    }

    // Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
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
      console.log('✅ Projects seeded');
    }

    // Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany([
        {
          title: 'Web Development',
          description: 'End-to-end web application development using modern frameworks and best practices. From MVPs to enterprise-grade solutions.',
          icon: '⚡',
          features: ['Custom React/Vue/Next.js Apps', 'REST & GraphQL APIs', 'Database Architecture', 'Performance Optimization', 'Deployment & DevOps'],
          price: 'From ₹2,500',
          order: 1, featured: true
        },
        {
          title: 'E-Commerce Solutions',
          description: 'High-converting online stores with seamless payment integration, inventory management, and marketing tools.',
          icon: '🛒',
          features: ['Shopify & Custom Stores', 'Payment Gateway Integration', 'Inventory Management', 'SEO Optimization', 'Analytics Dashboard'],
          price: 'From ₹3,500',
          order: 2, featured: true
        },
        {
          title: 'Mobile Development',
          description: 'Cross-platform mobile apps for iOS and Android with native performance and beautiful UX.',
          icon: '📱',
          features: ['React Native Apps', 'iOS & Android', 'Push Notifications', 'Offline Support', 'App Store Deployment'],
          price: 'From ₹4,000',
          order: 3, featured: true
        },
        {
          title: 'UI/UX Design',
          description: 'User-centered design that converts visitors into customers through thoughtful UX and stunning visuals.',
          icon: '🎨',
          features: ['User Research', 'Wireframing & Prototyping', 'Design Systems', 'Brand Identity', 'Usability Testing'],
          price: 'From ₹1,500',
          order: 4
        },
        {
          title: 'Technical Consulting',
          description: 'Strategic technical guidance to help your business make the right technology decisions.',
          icon: '🧠',
          features: ['Architecture Review', 'Tech Stack Selection', 'Code Audits', 'Scalability Planning', 'Team Mentoring'],
          price: '₹150/hour',
          order: 5
        },
        {
          title: 'Maintenance & Support',
          description: 'Ongoing support, updates, and optimization to keep your digital products running smoothly.',
          icon: '🔧',
          features: ['24/7 Monitoring', 'Bug Fixes', 'Security Updates', 'Performance Tuning', 'Monthly Reports'],
          price: 'From ₹500/mo',
          order: 6
        }
      ]);
      console.log('✅ Services seeded');
    }

    // Seed Testimonials
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      await Testimonial.insertMany([
        {
          name: 'Sarah Chen',
          role: 'CTO',
          company: 'NovaTech Ventures',
          message: 'Alex delivered our trading platform 2 weeks ahead of schedule with exceptional quality. The real-time features work flawlessly and our users love it. Highly recommend!',
          rating: 5, order: 1
        },
        {
          name: 'Marcus Williams',
          role: 'Founder',
          company: 'EcoShop',
          message: 'Working with Alex was transformative for our business. The AR try-on feature he built increased our conversion rate by 340%. Absolute genius at work.',
          rating: 5, order: 2
        },
        {
          name: 'Dr. Priya Patel',
          role: 'CEO',
          company: 'PulseHealth',
          message: 'Our healthcare platform needed to be bulletproof. Alex delivered HIPAA-compliant architecture that handles 50K+ patients seamlessly. Outstanding technical expertise.',
          rating: 5, order: 3
        },
        {
          name: 'Jake Rodriguez',
          role: 'Product Manager',
          company: 'TaskFlow Inc',
          message: 'The attention to detail and code quality is exceptional. Alex built our SaaS platform from scratch and it scales beautifully. Best developer we have ever worked with.',
          rating: 5, order: 4
        },
        {
          name: 'Emma Thompson',
          role: 'Marketing Director',
          company: 'BrandForge',
          message: 'Not just a coder — a true digital craftsman. Alex understood our brand vision and translated it into a stunning design system that our team loves to work with.',
          rating: 5, order: 5
        }
      ]);
      console.log('✅ Testimonials seeded');
    }

    // Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany([
        { name: 'React / Next.js', level: 95, category: 'frontend', order: 1 },
        { name: 'Vue.js / Nuxt', level: 88, category: 'frontend', order: 2 },
        { name: 'TypeScript', level: 92, category: 'frontend', order: 3 },
        { name: 'CSS / Tailwind', level: 90, category: 'frontend', order: 4 },
        { name: 'Node.js / Express', level: 93, category: 'backend', order: 5 },
        { name: 'Python / Django', level: 82, category: 'backend', order: 6 },
        { name: 'GraphQL', level: 85, category: 'backend', order: 7 },
        { name: 'PostgreSQL', level: 88, category: 'backend', order: 8 },
        { name: 'MongoDB', level: 90, category: 'backend', order: 9 },
        { name: 'AWS / GCP', level: 80, category: 'devops', order: 10 },
        { name: 'Docker / K8s', level: 78, category: 'devops', order: 11 },
        { name: 'React Native', level: 85, category: 'mobile', order: 12 }
      ]);
      console.log('✅ Skills seeded');
    }
  } catch (err) {
    console.log('Seed error:', err.message);
  }
};
