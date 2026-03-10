# Meela - Ayurvedic Hair Growth Oil

A modern, responsive e-commerce website for Meela Ayurvedic Hair Growth Oil, featuring a complete product showcase, blog system, and admin panel. Built with React and powered by Firebase.

![Meela Logo](./public/footer-logo.webp)

## 🌟 Features

### Customer-Facing Features
- **Modern Product Showcase** - Beautiful hero section with product highlights
- **Customer Reviews** - Interactive carousel showcasing customer testimonials
- **Ingredients Information** - Detailed information about 65+ powerful Ayurvedic herbs
- **Journey Timeline** - Visual storytelling of the product development process
- **FAQ Section** - Comprehensive answers to common questions
- **Blog System** - Educational content about hair care and Ayurvedic practices
- **Newsletter Subscription** - Stay connected with customers
- **Contact Section** - Easy customer communication
- **WhatsApp Integration** - Direct customer support via WhatsApp
- **Shopping Cart** - Smooth checkout experience with PDF invoice generation
- **Responsive Design** - Optimized for all devices (mobile, tablet, desktop)
- **Smooth Animations** - Enhanced UX with Framer Motion
- **Progress Indicator** - Scroll-to-top with progress tracking

### Admin Features
- **Admin Dashboard** - Manage website content
- **Blog Management** - Create, edit, and publish blog posts
- **Rich Text Editor** - Powered by React Quill for easy content creation

### Technical Features
- **SEO Optimized** - Sitemap, robots.txt, and meta tags
- **PWA Ready** - Progressive Web App with manifest.json
- **Performance Optimized** - Vite build with compression (Brotli & Gzip)
- **Security Headers** - XSS protection, frame options, and content security
- **Firebase Integration** - Firestore database for dynamic content
- **Modern UI/UX** - Tailwind CSS with custom design system

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool and dev server
- **React Router DOM 7.9.6** - Client-side routing
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **Framer Motion 12.23.24** - Animation library
- **React Icons 5.5.0** - Icon library

### Backend & Services
- **Firebase 12.6.0** - Backend as a Service (Firestore)
- **React Quill New 3.7.0** - Rich text editor for blog posts

### Additional Libraries
- **jsPDF 2.5.2** - PDF generation for invoices
- **React Swipeable 7.0.2** - Touch gestures for carousels

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **Terser** - JavaScript minification
- **Vite Plugin Compression** - Asset compression (Brotli & Gzip)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Firebase account** (for backend services)

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd meela
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Copy your Firebase configuration
   - Create a `src/firebase.js` file with your Firebase config:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

4. **Configure Firestore rules**
   - Deploy the firestore rules from `firestore.rules` to your Firebase project

## 💻 Usage

### Development Mode
Start the development server with hot module replacement:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Production Build
Build the application for production:
```bash
npm run build
```
The optimized build will be created in the `dist/` directory.

### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

### Linting
Run ESLint to check for code quality issues:
```bash
npm run lint
```

## 📁 Project Structure

```
meela/
├── public/                  # Static assets
│   ├── _headers            # HTTP headers configuration
│   ├── _redirects          # Redirect rules
│   ├── manifest.json       # PWA manifest
│   ├── robots.txt          # SEO robots file
│   ├── sitemap.xml         # SEO sitemap
│   └── *.webp, *.png       # Images and icons
├── src/
│   ├── components/         # React components
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── ProductHighlight.jsx
│   │   ├── ReviewsCarousel.jsx
│   │   ├── IngredientsSection.jsx
│   │   ├── FaqSection.jsx
│   │   ├── Footer.jsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── Blog.jsx
│   │   ├── BlogPost.jsx
│   │   ├── Checkout.jsx
│   │   └── Admin.jsx
│   ├── context/            # React Context providers
│   │   └── CartContext.jsx
│   ├── data/               # Static data files
│   │   ├── reviews.js
│   │   ├── ingredients.js
│   │   ├── faqs.js
│   │   └── ...
│   ├── firebase.js         # Firebase configuration
│   ├── App.jsx             # Main App component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── dist/                   # Production build output
├── firebase.json           # Firebase configuration
├── firestore.rules         # Firestore security rules
├── vercel.json            # Vercel deployment config
├── vite.config.js         # Vite configuration
├── tailwind.config.cjs    # Tailwind CSS configuration
├── package.json           # Project dependencies
└── README.md              # This file
```

## 🔥 Firebase Setup

### Firestore Collections
The application uses the following Firestore collections:
- **blogs** - Blog posts with rich content
- **orders** - Customer orders (if implemented)
- **newsletter** - Newsletter subscribers

### Firestore Security Rules
Make sure to configure proper security rules in `firestore.rules` before deploying to production.

## 🌐 Deployment

### Vercel (Recommended)
The project includes a `vercel.json` configuration file for easy deployment:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Other Platforms
You can also deploy to:
- **Netlify** - Use the `dist/` folder with `_redirects` file
- **Firebase Hosting** - Configure in `firebase.json`
- **GitHub Pages** - May require additional configuration for SPA routing

## 🎨 Customization

### Color Scheme
The project uses a custom color palette defined in Tailwind config:
- **Cream Background** - `#f7efe6`
- **Coffee Text** - `#6f4a3c`

### Branding
Update the following files to customize branding:
- `public/manifest.json` - PWA metadata
- `public/footer-logo.webp` - Logo image
- `src/components/Navbar.jsx` - Navigation branding
- `src/components/Footer.jsx` - Footer content

## 📱 PWA Features

The application is PWA-ready with:
- Service worker support (can be added)
- Web app manifest
- Offline capability (can be enhanced)
- Add to home screen functionality

## 🔒 Security

The project implements security best practices:
- XSS Protection headers
- Frame options to prevent clickjacking
- Content Security Policy
- Referrer policy
- Secure asset caching

## 📈 Performance Optimization

- **Code Splitting** - React Router based lazy loading
- **Image Optimization** - WebP and AVIF formats
- **Asset Compression** - Brotli and Gzip compression
- **CSS Purging** - Tailwind removes unused styles
- **Minification** - Terser for JavaScript minification

## 📚 Additional Documentation

- [Blog System Guide](./BLOG_SYSTEM_GUIDE.md) - Detailed guide for managing the blog
- [SEO Optimization Guide](./SEO_OPTIMIZATION_GUIDE.md) - SEO best practices

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved.


## 🙏 Acknowledgments

- Ayurvedic herbs and ingredients information
- Customer testimonials and reviews
- Design inspiration from modern e-commerce platforms

---

**Built with ❤️ for natural hair care**
