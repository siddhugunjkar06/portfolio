# ⚡ Portfolio Website — Full Stack Node.js

A premium, production-ready portfolio website built with **Node.js, Express, EJS, MongoDB, and CSS animations**.

---

## 🚀 Features

### Public Site
- **Animated Hero** — Code preview card, gradient text, floating orbs, grid background
- **Services Section** — 6 service cards with hover effects and pricing
- **Projects Gallery** — Filter by category, animated cards, live/GitHub links
- **Skills Section** — Animated progress bars with intersection observer
- **Testimonials Slider** — Auto-play carousel with dot navigation
- **Contact Form** — AJAX submit with toast notifications
- **Blog** — Published posts with tags and view counts
- **Custom Cursor** — Smooth cursor ring animation (desktop)
- **Page Loader** — Branded loading animation
- **Scroll Reveal** — Staggered element animations on scroll
- **Responsive** — Mobile-first design, hamburger menu

### Admin Panel (`/admin`)
- **Dashboard** — Stats cards, recent messages, site status, quick actions
- **Projects CRUD** — Create, edit, delete with image upload, featured toggle
- **Services CRUD** — Manage services with features list and pricing
- **Messages** — View, status update, reply via email, delete
- **Testimonials** — Add/remove client testimonials with star ratings
- **Skills** — Manage tech stack with proficiency bars
- **Blog** — Create and manage blog posts
- **Settings** — Update all site content, social links, stats, password

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| View Engine | EJS (Embedded JavaScript) |
| Database | MongoDB + Mongoose |
| Auth | bcryptjs + express-session |
| File Upload | Multer |
| Styling | Custom CSS (no frameworks) |
| Fonts | Clash Display + DM Sans |
| Icons | Font Awesome 6 |

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))

### Steps

```bash
# 1. Navigate to the project folder
cd portfolio

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your values

# 4. Start MongoDB (if local)
mongod

# 5. Run the app
npm start

# Development (with auto-reload)
npm run dev
```

### Environment Variables (`.env`)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/portfolio
SESSION_SECRET=change-this-to-a-long-random-string
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=Admin@123456
```

---

## 🔐 Admin Access

| URL | Credentials |
|-----|-------------|
| `http://localhost:3000/admin/login` | admin@portfolio.com / Admin@123456 |

> ⚠️ **Change the default password immediately** in Admin → Settings → Change Password

---

## 📁 Project Structure

```
portfolio/
├── app.js              # Express app entry
├── .env                # Environment config
├── models/
│   └── index.js        # All Mongoose models
├── routes/
│   ├── public.js       # Public site routes
│   ├── admin.js        # Admin CRUD routes
│   └── api.js          # JSON API routes
├── middleware/
│   └── auth.js         # Session auth guards
├── config/
│   └── seed.js         # Initial data seeder
├── views/
│   ├── partials/
│   │   └── layout.ejs  # Public layout wrapper
│   ├── index.ejs       # Homepage
│   ├── projects.ejs    # Projects gallery
│   ├── services.ejs    # Services page
│   ├── contact.ejs     # Contact form
│   ├── blog.ejs        # Blog listing
│   └── admin/
│       ├── layout.ejs  # Admin sidebar layout
│       ├── login.ejs
│       ├── dashboard.ejs
│       ├── projects.ejs + project-form.ejs
│       ├── services.ejs + service-form.ejs
│       ├── contacts.ejs
│       ├── testimonials.ejs
│       ├── skills.ejs
│       ├── blog.ejs + blog-form.ejs
│       └── settings.ejs
├── public/
│   ├── css/
│   │   ├── style.css   # Main site styles
│   │   └── admin.css   # Admin panel styles
│   └── js/
│       ├── main.js     # Site interactions
│       └── admin.js    # Admin interactions
└── uploads/            # User-uploaded images
```

---

## 🎨 Customization

1. **Branding** → Admin → Settings → Site Name, Tagline, Bio
2. **Projects** → Admin → Projects → Add/Edit
3. **Services** → Admin → Services → Add/Edit
4. **Testimonials** → Admin → Testimonials → Add
5. **Skills** → Admin → Skills → Add (with % proficiency)
6. **Social Links** → Admin → Settings → Social Media
7. **Contact Info** → Admin → Settings → General

---

## 🌐 Deployment

### Render / Railway / Fly.io
```bash
# Set environment variables in dashboard
MONGODB_URI=mongodb+srv://...  # Use Atlas connection string
SESSION_SECRET=your-long-secret
NODE_ENV=production
```

### MongoDB Atlas (Free tier)
1. Create free cluster at cloud.mongodb.com
2. Get connection string
3. Set as `MONGODB_URI`

---

## 📄 License

MIT — Free to use for personal and commercial projects.
