require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// ─── CSP / Security Headers ──────────────────────────
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' blob: https://cdnjs.cloudflare.com https://upload.cloudinary.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com https://cdnjs.cloudflare.com",
      "font-src 'self' data: https://fonts.gstatic.com https://api.fontshare.com https://cdnjs.cloudflare.com",
      "img-src 'self' data: blob: https: https://res.cloudinary.com",
      "connect-src 'self' https://api.cloudinary.com",
    ].join('; ')
  );
  next();
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'portfolio-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(flash());

// Global Variables Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.isAdmin = req.session.isAdmin || false;
  res.locals.adminName = req.session.adminName || 'Admin';
  next();
});

// ─── SEO Middleware ──────────────────────────
// Robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Allow: /projects
Allow: /services
Allow: /blog
Allow: /faq
Allow: /contact
Disallow: /admin
Disallow: /api
Disallow: /uploads
Sitemap: https://sgdeveloper.onrender.com/sitemap.xml`);
});

// Sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
  const { Project, Blog } = require('./models');
  const baseUrl = process.env.BASE_URL || 'https://sgdeveloper.onrender.com';
  
  try {
    const [projects, blogs] = await Promise.all([
      Project.find({ status: 'active' }),
      Blog.find({ status: 'published' })
    ]);

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Static pages
    const staticPages = ['/', '/projects', '/services', '/blog', '/faq', '/contact'];
    staticPages.forEach(page => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}${page}</loc>\n`;
      sitemap += `    <changefreq>${page === '/' ? 'weekly' : 'monthly'}</changefreq>\n`;
      sitemap += `    <priority>${page === '/' ? '1.0' : '0.8'}</priority>\n`;
      sitemap += `  </url>\n`;
    });

    // Dynamic project pages
    projects.forEach(project => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/projects/${project._id}</loc>\n`;
      sitemap += `    <lastmod>${project.updatedAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}</lastmod>\n`;
      sitemap += `    <changefreq>monthly</changefreq>\n`;
      sitemap += `    <priority>0.7</priority>\n`;
      sitemap += `  </url>\n`;
    });

    // Dynamic blog pages
    blogs.forEach(blog => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/blog/${blog._id}</loc>\n`;
      sitemap += `    <lastmod>${blog.updatedAt?.toISOString().split('T')[0] || blog.createdAt?.toISOString().split('T')[0]}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.6</priority>\n`;
      sitemap += `  </url>\n`;
    });

    sitemap += '</urlset>';

    res.type('application/xml');
    res.send(sitemap);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('Error generating sitemap');
  }
});

// Routes
app.use('/', require('./routes/public'));
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));

// Seed initial data
const seedData = require('./config/seed');
seedData();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔐 Admin panel: http://localhost:${PORT}/admin/login`);
});
