const express = require('express');
const router = express.Router();
const { Project, Service, Testimonial, Skill, Settings, Contact, Blog } = require('../models');
const {
  getBreadcrumbSchema,
  getFAQSchema,
  getReviewSchema,
  getServicesSchema,
  getServiceProductSchema,
  getProjectSchema,
  getWebPageSchema,
  getOrganizationSchema
} = require('../config/seo');

const baseUrl = process.env.BASE_URL || 'https://sgdeveloper.onrender.com';

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

    // Generate SEO schemas
    const jsonLdSchemas = [
      getOrganizationSchema(settings),
      getWebPageSchema(
        settings.siteName || 'SG Developer - Full-Stack Developer',
        settings.tagline || 'Professional full-stack developer offering web development, mobile apps, UI/UX design, and technical consulting services.',
        '/'
      ),
      {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        '@id': baseUrl + '#portfolio-showcase',
        name: 'Portfolio Projects',
        description: 'Showcase of completed projects and digital solutions',
        creator: {
          '@type': 'Person',
          name: settings.siteName || 'SG Developer'
        }
      }
    ];

    // Add review schema
    if (testimonials && testimonials.length > 0) {
      jsonLdSchemas.push(getReviewSchema(testimonials));
    }

    // Breadcrumbs
    const breadcrumbs = [
      { name: 'Home', url: '/' }
    ];

    // OpenGraph tags
    const ogTags = {
      'og:title': settings.siteName || 'SG Developer',
      'og:description': settings.tagline || 'Professional Full-Stack Developer',
      'og:image': baseUrl + '/images/og-home.png',
      'og:url': baseUrl + '/',
      'og:type': 'website',
      'og:site_name': settings.siteName || 'SG Developer',
      'twitter:title': settings.siteName || 'SG Developer',
      'twitter:description': settings.tagline || 'Professional Full-Stack Developer',
      'twitter:image': baseUrl + '/images/og-home.png'
    };

    res.render('index', {
      settings,
      featuredProjects,
      services,
      testimonials,
      skills,
      page: 'home',
      jsonLdSchemas,
      breadcrumbs,
      ogTags,
      canonicalUrl: baseUrl + '/'
    });
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

    // Generate SEO schemas
    const jsonLdSchemas = [
      getWebPageSchema(
        'Projects - ' + (settings.siteName || 'SG Developer'),
        'Portfolio of completed web development, mobile app, and digital solution projects showcasing expertise and technical skills.',
        '/projects'
      )
    ];

    // Add project schemas
    projects.forEach(project => {
      jsonLdSchemas.push(getProjectSchema(project));
    });

    // Breadcrumbs
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Projects', url: '/projects' }
    ];

    // OpenGraph tags
    const ogTags = {
      'og:title': 'My Projects - ' + (settings.siteName || 'SG Developer'),
      'og:description': 'Explore my portfolio of completed projects demonstrating technical expertise and creative solutions.',
      'og:image': baseUrl + '/images/og-projects.png',
      'og:url': baseUrl + '/projects',
      'og:type': 'website',
      'og:site_name': settings.siteName || 'SG Developer',
      'twitter:title': 'My Projects - ' + (settings.siteName || 'SG Developer'),
      'twitter:description': 'Explore my portfolio of completed projects demonstrating technical expertise and creative solutions.',
      'twitter:image': baseUrl + '/images/og-projects.png'
    };

    res.render('projects', {
      settings,
      projects,
      activeCategory: category || 'all',
      page: 'projects',
      jsonLdSchemas,
      breadcrumbs,
      ogTags,
      canonicalUrl: baseUrl + '/projects'
    });
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

    // Generate SEO schemas
    const jsonLdSchemas = [
      getProjectSchema(project)
    ];

    // Breadcrumbs
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Projects', url: '/projects' },
      { name: project.title, url: `/projects/${project._id}` }
    ];

    // OpenGraph tags
    const ogTags = {
      'og:title': project.title + ' - ' + (settings.siteName || 'SG Developer'),
      'og:description': project.description || 'Check out this project',
      'og:image': project.image || baseUrl + '/images/og-project.png',
      'og:url': baseUrl + `/projects/${project._id}`,
      'og:type': 'website',
      'og:site_name': settings.siteName || 'SG Developer',
      'twitter:title': project.title,
      'twitter:description': project.description || 'Check out this project',
      'twitter:image': project.image || baseUrl + '/images/og-project.png'
    };

    res.render('project-detail', {
      settings,
      project,
      relatedProjects,
      page: 'projects',
      jsonLdSchemas,
      breadcrumbs,
      ogTags,
      canonicalUrl: baseUrl + `/projects/${project._id}`
    });
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

    // Generate SEO schemas
    const jsonLdSchemas = [
      getWebPageSchema(
        'Services - ' + (settings.siteName || 'SG Developer'),
        'Full-range digital services including web development, mobile apps, e-commerce solutions, UI/UX design, and technical consulting.',
        '/services'
      ),
      ...getServicesSchema(services, settings),
      ...getServiceProductSchema(services)
    ];

    // Breadcrumbs
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' }
    ];

    // OpenGraph tags
    const ogTags = {
      'og:title': 'Services - ' + (settings.siteName || 'SG Developer'),
      'og:description': 'Professional digital services including web development, mobile apps, e-commerce, UI/UX design, and consulting.',
      'og:image': baseUrl + '/images/og-services.png',
      'og:url': baseUrl + '/services',
      'og:type': 'website',
      'og:site_name': settings.siteName || 'SG Developer',
      'twitter:title': 'Digital Services - ' + (settings.siteName || 'SG Developer'),
      'twitter:description': 'Professional digital services including web development, mobile apps, e-commerce, UI/UX design, and consulting.',
      'twitter:image': baseUrl + '/images/og-services.png'
    };

    res.render('services', {
      settings,
      services,
      page: 'services',
      jsonLdSchemas,
      serviceSchemas: getServicesSchema(services, settings),
      breadcrumbs,
      ogTags,
      canonicalUrl: baseUrl + '/services'
    });
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

    // Generate SEO schemas
    const jsonLdSchemas = [
      getWebPageSchema(
        'Blog - ' + (settings.siteName || 'SG Developer'),
        'Latest articles, tutorials, and insights about web development, mobile apps, and digital solutions.',
        '/blog'
      )
    ];

    // Add blog article schemas
    posts.forEach(post => {
      jsonLdSchemas.push({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt || post.content?.substring(0, 160),
        image: post.image || baseUrl + '/images/default-blog.png',
        datePublished: post.createdAt,
        dateModified: post.updatedAt || post.createdAt,
        author: {
          '@type': 'Person',
          name: settings.siteName || 'SG Developer'
        }
      });
    });

    // Breadcrumbs
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' }
    ];

    // OpenGraph tags
    const ogTags = {
      'og:title': 'Blog - ' + (settings.siteName || 'SG Developer'),
      'og:description': 'Read latest articles and insights about web development, technology, and digital solutions.',
      'og:image': baseUrl + '/images/og-blog.png',
      'og:url': baseUrl + '/blog',
      'og:type': 'website',
      'og:site_name': settings.siteName || 'SG Developer',
      'twitter:title': 'Blog - ' + (settings.siteName || 'SG Developer'),
      'twitter:description': 'Read latest articles and insights about web development, technology, and digital solutions.',
      'twitter:image': baseUrl + '/images/og-blog.png'
    };

    res.render('blog', {
      settings,
      posts,
      page: 'blog',
      jsonLdSchemas,
      breadcrumbs,
      ogTags,
      canonicalUrl: baseUrl + '/blog'
    });
  } catch (err) {
    res.status(500).render('error', { message: 'Server error' });
  }
});

// CONTACT PAGE
router.get('/contact', async (req, res) => {
  try {
    const settings = await getSettings();

    // Generate SEO schemas
    const jsonLdSchemas = [
      getWebPageSchema(
        'Contact - ' + (settings.siteName || 'SG Developer'),
        'Get in touch with SG Developer for your web development, mobile app, or digital consulting needs.',
        '/contact'
      ),
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPoint',
        telephoneNumber: settings.phone || '+917410705015',
        contactType: 'Customer Service',
        email: settings.email || 'siddhugunjkar06@gmail.com',
        areaServed: 'IN'
      }
    ];

    // Breadcrumbs
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Contact', url: '/contact' }
    ];

    // OpenGraph tags
    const ogTags = {
      'og:title': 'Contact - ' + (settings.siteName || 'SG Developer'),
      'og:description': 'Get in touch with me to discuss your project or digital needs.',
      'og:image': baseUrl + '/images/og-contact.png',
      'og:url': baseUrl + '/contact',
      'og:type': 'website',
      'og:site_name': settings.siteName || 'SG Developer',
      'twitter:title': 'Contact - ' + (settings.siteName || 'SG Developer'),
      'twitter:description': 'Get in touch with me to discuss your project or digital needs.',
      'twitter:image': baseUrl + '/images/og-contact.png'
    };

    res.render('contact', {
      settings,
      page: 'contact',
      jsonLdSchemas,
      breadcrumbs,
      ogTags,
      canonicalUrl: baseUrl + '/contact'
    });
  } catch (err) {
    res.status(500).render('error', { message: 'Server error' });
  }
});

// FAQ PAGE
router.get('/faq', async (req, res) => {
  try {
    const settings = await getSettings();

    // FAQ Data - Comprehensive FAQs for business growth
    const faqs = [
      {
        question: 'What services do you offer?',
        answer: 'I offer comprehensive digital services including Web Development (custom React/Vue/Next.js apps, REST & GraphQL APIs, database architecture), E-Commerce Solutions (Shopify, custom stores, payment integration), Mobile App Development (React Native, iOS/Android, cross-platform apps), UI/UX Design (user research, wireframing, design systems), Technical Consulting (architecture review, tech stack selection, code audits), and Maintenance & Support (24/7 monitoring, bug fixes, security updates).'
      },
      {
        question: 'How long does a typical project take?',
        answer: 'Project timelines vary based on scope and complexity. A basic website or landing page typically takes 2-4 weeks. A custom e-commerce platform might take 4-8 weeks. Enterprise solutions and complex applications can take 3-6 months. During the discovery phase, I provide accurate project timelines and milestones for your specific requirements.'
      },
      {
        question: 'Do you work with startups and small businesses?',
        answer: 'Yes! I work with startups, small businesses, enterprises, and agencies. I offer flexible engagement models including fixed-price projects, hourly consulting, monthly retainers, and performance-based pricing. My goal is to deliver high-quality digital solutions regardless of company size or budget.'
      },
      {
        question: 'What is your development process?',
        answer: 'My process consists of four key phases: (1) Discovery - understanding your goals, audience, and technical requirements through detailed consultation; (2) Design - creating wireframes, prototypes, and design mockups with your feedback; (3) Development - building scalable, clean code with regular check-ins and updates; (4) Deploy - comprehensive testing, optimization, launch, and ongoing support.'
      },
      {
        question: 'Can you work on existing projects or legacy codebases?',
        answer: 'Absolutely! I specialize in working with existing projects including maintenance, updates, refactoring, and modernization. I can conduct code audits, identify technical debt, implement improvements for performance and security, and help you upgrade legacy systems to modern tech stacks.'
      },
      {
        question: 'What technologies and programming languages do you use?',
        answer: 'Frontend: React, Vue.js, Next.js, TypeScript, Tailwind CSS. Backend: Node.js, Express.js, Python, Django, GraphQL. Databases: MongoDB, PostgreSQL, MySQL. Mobile: React Native, Flutter. DevOps: AWS, GCP, Docker, Kubernetes. I choose the best tech stack based on your project requirements and business goals.'
      },
      {
        question: 'How do you ensure code quality and security?',
        answer: 'I follow industry best practices including automated testing (unit, integration, e2e), code reviews, security audits, performance optimization, and vulnerability assessments. I use modern development tools, maintain strict coding standards, implement proper authentication and authorization, and follow OWASP guidelines to ensure production-ready, secure code.'
      },
      {
        question: 'What is your pricing structure?',
        answer: 'Pricing varies based on project scope and complexity. Web Development starts from $2,500, E-Commerce Solutions from $3,500, Mobile Apps from $4,000, UI/UX Design from $1,500, and Technical Consulting at $150/hour. I offer custom quotes for complex projects, monthly retainers, and flexible payment terms.'
      },
      {
        question: 'Do you provide post-launch support and maintenance?',
        answer: 'Yes, I offer comprehensive post-launch support including 24/7 monitoring, bug fixes, security updates, performance optimization, feature additions, and scalability improvements. I can work on monthly retainers or as-needed basis depending on your requirements.'
      },
      {
        question: 'How do you communicate with clients?',
        answer: 'I maintain clear, regular communication through email, Slack, WhatsApp, video calls, and project management tools. I provide weekly progress updates, attend regular check-in meetings, and ensure transparency throughout the project. My clients have 24-hour response time expectations.'
      },
      {
        question: 'Can you help with SEO and digital marketing?',
        answer: 'Yes! I implement SEO best practices in web development including proper heading structure, meta tags, canonical URLs, structured data (JSON-LD), mobile optimization, fast page load times, and Core Web Vitals optimization. I can integrate analytics, conversion tracking, and help with digital marketing strategy implementation.'
      },
      {
        question: 'What about API development and integrations?',
        answer: 'I design and develop RESTful APIs and GraphQL services, integrate third-party services (payment gateways, email services, cloud storage), implement webhook integrations, and build scalable backend systems. I ensure proper documentation, security, rate limiting, and error handling.'
      },
      {
        question: 'Do you offer training or knowledge transfer?',
        answer: 'Yes, I provide comprehensive documentation, code comments, and training sessions for your team. I can document APIs, create user guides, conduct technical workshops, and ensure your team understands the codebase for future maintenance and improvements.'
      },
      {
        question: 'What about performance optimization and scalability?',
        answer: 'I implement performance optimization techniques including code splitting, lazy loading, caching strategies, CDN integration, database optimization, and infrastructure scaling. I monitor performance metrics and continuously optimize for speed, reliability, and user experience.'
      },
      {
        question: 'Can you help with migrating from another developer or agency?',
        answer: 'Absolutely! I specialize in smooth transitions including codebase audits, documentation of existing systems, gradual migration to new architecture, training your team, and ensuring zero downtime during the transition process.'
      }
    ];

    // Generate JSON-LD FAQ Schema
    const faqSchema = getFAQSchema();
    
    // Update FAQ schema with actual data from database or config
    if (Array.isArray(faqSchema.mainEntity)) {
      // Keep the default FAQs from getFAQSchema as fallback or merge with external data
    }

    const jsonLdSchemas = [
      getWebPageSchema(
        'FAQ - ' + (settings.siteName || 'SG Developer'),
        'Frequently asked questions about web development services, pricing, process, and technology stack.',
        '/faq'
      ),
      faqSchema
    ];

    // Breadcrumbs
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'FAQ', url: '/faq' }
    ];

    // OpenGraph tags
    const ogTags = {
      'og:title': 'FAQ - ' + (settings.siteName || 'SG Developer'),
      'og:description': 'Frequently asked questions about services, pricing, and web development process.',
      'og:image': baseUrl + '/images/og-faq.png',
      'og:url': baseUrl + '/faq',
      'og:type': 'website',
      'og:site_name': settings.siteName || 'SG Developer',
      'twitter:title': 'FAQ - ' + (settings.siteName || 'SG Developer'),
      'twitter:description': 'Frequently asked questions about services, pricing, and web development process.',
      'twitter:image': baseUrl + '/images/og-faq.png'
    };

    res.render('faq', {
      settings,
      faqs,
      page: 'faq',
      isFaqPage: true,
      jsonLdSchemas,
      breadcrumbs,
      ogTags,
      canonicalUrl: baseUrl + '/faq'
    });
  } catch (err) {
    console.error(err);
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
