/**
 * SEO Helper - Generates SEO metadata, JSON-LD structured data, and OpenGraph tags
 */

const baseUrl = process.env.BASE_URL || 'https://sgdeveloper.onrender.com';

/**
 * Generate JSON-LD Schema for Organization
 */
function getOrganizationSchema(settings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': baseUrl + '#organization',
    name: settings.siteName || 'SG Developer',
    description: settings.bio || 'Full-stack developer providing web development, mobile apps, and digital consulting services.',
    url: baseUrl,
    telephone: settings.phone || '+917410705015',
    email: settings.email || 'siddhugunjkar06@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.addressStreet || 'Parbhani',
      addressLocality: settings.addressCity || 'Parbhani',
      addressRegion: settings.addressState || 'MH',
      postalCode: settings.postalCode || '',
      addressCountry: settings.addressCountry || 'IN'
    },
    sameAs: [
      settings.github || 'https://github.com',
      settings.linkedin || 'https://linkedin.com',
      settings.instagram || 'https://instagram.com'
    ],
    image: {
      '@type': 'ImageObject',
      url: baseUrl + '/images/logo.png',
      width: 200,
      height: 200
    },
    areaServed: ['IN', 'US', 'GB', 'CA', 'AU'],
    award: ['Award Winner', 'Expert Developer'],
    knowsLanguage: ['en', 'hi'],
    priceRange: '₹₹'
  };
}

/**
 * Generate JSON-LD Schema for Services
 */
function getServicesSchema(services, settings) {
  const serviceSchemas = services.map((service, i) => ({
    '@type': 'Service',
    '@id': baseUrl + `/service/${service._id || i}`,
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: settings.siteName || 'SG Developer',
      url: baseUrl
    },
    areaServed: 'IN',
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: baseUrl + '/contact'
    },
    image: service.image || baseUrl + '/images/default-service.png',
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: service.price.replace(/\D/g, ''),
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    })
  }));

  return serviceSchemas;
}

/**
 * Generate JSON-LD Schema for Products/Services with Pricing
 */
function getServiceProductSchema(services) {
  return services
    .filter(s => s.price)
    .map(service => ({
      '@type': 'Product',
      name: service.title,
      description: service.description,
      image: service.image || baseUrl + '/images/default-service.png',
      offers: {
        '@type': 'Offer',
        url: baseUrl + '/contact',
        priceCurrency: 'USD',
        price: service.price.replace(/\D/g, ''),
        availability: 'https://schema.org/InStock'
      }
    }));
}

/**
 * Generate JSON-LD Schema for Projects/Portfolio Items
 */
function getProjectSchema(project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    image: project.image || baseUrl + '/images/default-project.png',
    url: baseUrl + `/projects/${project._id || project.slug}`,
    creator: {
      '@type': 'Person',
      name: 'SG Developer'
    },
    dateCreated: project.createdAt,
    datePublished: project.publishedAt || project.createdAt,
    technologies: project.technologies || []
  };
}

/**
 * Generate Breadcrumb Navigation Schema
 */
function getBreadcrumbSchema(breadcrumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: baseUrl + item.url
    }))
  };
}

/**
 * Generate FAQ Page Schema
 */
function getFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What services do you offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'I offer comprehensive digital services including Web Development, E-Commerce Solutions, Mobile App Development, UI/UX Design, Technical Consulting, and Maintenance & Support. Each service is tailored to your business needs and budget.'
        }
      },
      {
        '@type': 'Question',
        name: 'How long does a typical project take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Project timelines vary based on scope and complexity. A basic website might take 2-4 weeks, while enterprise solutions may take 3-6 months. During the discovery phase, I provide accurate timelines for your specific project.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you work with startups and small businesses?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! I work with startups, small businesses, and enterprises. I offer flexible engagement models and pricing to accommodate different budget levels. My goal is to deliver high-quality digital solutions regardless of company size.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is your development process?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'My process consists of four phases: (1) Discovery - understanding your goals and requirements, (2) Design - creating wireframes and prototypes, (3) Development - building with clean, scalable code, (4) Deploy - testing, optimization, and launch with ongoing support.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can you work on existing projects?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely! I provide maintenance, updates, optimizations, and even complete rewrites of existing applications. I can audit your codebase and recommend improvements for performance and security.'
        }
      },
      {
        '@type': 'Question',
        name: 'What technologies do you work with?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'I specialize in modern web technologies including React, Vue.js, Next.js, Node.js, Express.js, MongoDB, PostgreSQL, and many more. I choose the best technology stack based on your project requirements.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do you ensure code quality and security?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'I follow best practices including code reviews, unit testing, integration testing, security audits, and performance optimization. I use modern development tools and maintain strict coding standards to ensure production-ready code.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the pricing structure?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pricing varies based on project scope. Web Development starts from ₹2,500, E-Commerce from ₹3,500, Mobile Dev from ₹4,000, UI/UX Design from ₹1,500, and Technical Consulting at ₹150/hour. Contact me for custom quotes on complex projects.'
        }
      }
    ]
  };
}

/**
 * Generate Review/Rating Schema
 */
function getReviewSchema(testimonials) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SG Developer',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: testimonials.length,
      bestRating: '5',
      worstRating: '1'
    },
    review: testimonials.map(testimonial => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
        worstRating: '1'
      },
      author: {
        '@type': 'Person',
        name: testimonial.author || 'Client'
      },
      reviewBody: testimonial.text || testimonial.feedback,
      datePublished: testimonial.createdAt || new Date().toISOString()
    }))
  };
}

/**
 * Generate WebPage Schema for individual pages
 */
function getWebPageSchema(pageTitle, pageDescription, url, breadcrumbs = []) {
  const pageUrl = baseUrl + url;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': pageUrl + '#webpage',
    url: pageUrl,
    name: pageTitle,
    description: pageDescription,
    isPartOf: {
      '@id': baseUrl + '#website'
    },
    dateModified: new Date().toISOString(),
    isAccessibleForFree: true
  };
}

/**
 * Generate Website Schema
 */
function getWebsiteSchema(settings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Website',
    '@id': baseUrl + '#website',
    url: baseUrl,
    name: settings.siteName || 'SG Developer',
    description: settings.tagline || 'Professional Full-Stack Developer',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: baseUrl + '/search?q={search_term_string}'
      },
      query: 'required name=search_term_string'
    }
  };
}

/**
 * Generate OpenGraph Meta Tags
 */
function getOpenGraphTags(pageTitle, pageDescription, imageUrl, pageUrl) {
  return {
    'og:title': pageTitle,
    'og:description': pageDescription,
    'og:url': pageUrl,
    'og:image': imageUrl,
    'og:type': 'website',
    'og:site_name': 'SG Developer',
    'instagram:card': 'summary_large_image',
    'instagram:title': pageTitle,
    'instagram:description': pageDescription,
    'instagram:image': imageUrl
  };
}

/**
 * Generate Instagram Card Meta Tags
 */
function getInstagramCardTags(pageTitle, pageDescription, imageUrl) {
  return {
    'instagram:card': 'summary_large_image',
    'instagram:title': pageTitle,
    'instagram:description': pageDescription,
    'instagram:image': imageUrl,
    'instagram:site': settings.instagram ? '@' + settings.instagram.split('/').pop() : '@sgdeveloper'
  };
}

/**
 * Generate all necessary meta tags for a page
 */
function generatePageMeta(pageTitle, pageDescription, imageUrl = null, canonicalUrl = null) {
  const tags = [
    { name: 'description', content: pageDescription },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'theme-color', content: '#000000' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'format-detection', content: 'telephone=no' },
    // Robots meta
    { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
    // Language
    { httpEquiv: 'content-language', content: 'en' },
    // Author
    { name: 'author', content: 'SG Developer' },
    // Keywords
    { name: 'keywords', content: 'web development, mobile development, full-stack developer, UI/UX design, freelance developer, web designer' },
    // Canonical
    ...(canonicalUrl ? [{ rel: 'canonical', href: canonicalUrl }] : []),
    // OpenGraph
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonicalUrl || baseUrl }
  ];

  if (imageUrl) {
    tags.push(
      { property: 'og:image', content: imageUrl },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'instagram:card', content: 'summary_large_image' },
      { property: 'instagram:image', content: imageUrl }
    );
  }

  return tags;
}

/**
 * Main export function to generate complete SEO data
 */
function generateSeoData(options = {}) {
  const {
    pageTitle,
    pageDescription,
    pageUrl,
    canonicalUrl,
    imageUrl,
    breadcrumbs = [],
    schemas = [],
    settings = {},
    projects = [],
    services = [],
    testimonials = []
  } = options;

  const metaTags = generatePageMeta(
    pageTitle,
    pageDescription,
    imageUrl,
    canonicalUrl
  );

  const jsonLd = [
    getWebsiteSchema(settings),
    getOrganizationSchema(settings),
    ...schemas
  ];

  return {
    metaTags,
    jsonLd,
    title: pageTitle,
    description: pageDescription,
    url: canonicalUrl || pageUrl,
    image: imageUrl || baseUrl + '/images/og-image.png'
  };
}

module.exports = {
  baseUrl,
  generateSeoData,
  generatePageMeta,
  getOrganizationSchema,
  getServicesSchema,
  getServiceProductSchema,
  getProjectSchema,
  getBreadcrumbSchema,
  getFAQSchema,
  getReviewSchema,
  getWebPageSchema,
  getWebsiteSchema,
  getOpenGraphTags,
  getInstagramCardTags
};
