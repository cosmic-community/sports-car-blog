# Sports Car Blog

![App Preview](https://imgix.cosmicjs.com/ae691390-3378-11f1-955d-6d40e21843ee-autopilot-photo-1621135802920-133df287f89c-1775672883918.jpeg?w=1200&h=630&fit=crop&auto=format,compress)

A stunning sports car blog built with Next.js 16 and Cosmic CMS. Featuring dynamic blog posts, author profiles, category pages, and a beautiful dark-themed design inspired by high-performance automobiles.

## Features

- 🏎️ **Dynamic Blog Posts** — Rich content pages with featured images, author info, and tags
- 👤 **Author Profiles** — Dedicated author pages with bios, social links, and published posts
- 🏷️ **Category Pages** — Browse posts organized by category
- 📱 **Fully Responsive** — Beautiful on mobile, tablet, and desktop
- ⚡ **Server-Side Rendering** — Fast page loads with Next.js 16 Server Components
- 🔍 **SEO Optimized** — Dynamic metadata for every page
- 🎨 **Modern Dark Theme** — Bold design with red accents inspired by sports cars

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](http://localhost:3040/projects/new?clone_bucket=69d69dccc278009d3a11d66f&clone_repository=69d69f240c1864462abd7426)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create content models for a blog with posts (including featured images, content, and tags), authors, and categories. User instructions: A blog about sports cars."

### Code Generation Prompt

> "Build a Next.js application for a creative portfolio called 'Sports Car Blog'. The content is managed in Cosmic CMS with the following object types: categories, authors, posts. Create a beautiful, modern, responsive design with a homepage and pages for each content type. User instructions: A blog about sports cars."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [React 19](https://react.dev/) — UI library
- [Cosmic](https://www.cosmicjs.com) — Headless CMS ([docs](https://www.cosmicjs.com/docs))
- [Tailwind CSS 3](https://tailwindcss.com/) — Utility-first CSS framework
- [TypeScript 5](https://www.typescriptlang.org/) — Type safety

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- A [Cosmic](https://www.cosmicjs.com) account with a configured bucket

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd sports-car-blog
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
Create a `.env.local` file with your Cosmic credentials:
```
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server:
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the blog.

## Cosmic SDK Examples

### Fetching Posts
```typescript
import { cosmic } from '@/lib/cosmic'

const { objects: posts } = await cosmic.objects
  .find({ type: 'posts' })
  .props(['id', 'title', 'slug', 'metadata', 'created_at'])
  .depth(1)
```

### Fetching a Single Post by Slug
```typescript
const { object: post } = await cosmic.objects
  .findOne({ type: 'posts', slug: 'my-post-slug' })
  .props(['id', 'title', 'slug', 'metadata', 'created_at'])
  .depth(1)
```

## Cosmic CMS Integration

This app uses the following Cosmic object types:

| Object Type | Fields |
|-------------|--------|
| **Posts** | content, featured_image, tags, author (→ Authors), category (→ Categories) |
| **Authors** | name, bio, photo, social_link |
| **Categories** | name, description |

All content is fetched server-side using the Cosmic SDK with `depth(1)` to resolve related objects (authors and categories within posts).

## Deployment Options

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add environment variables (COSMIC_BUCKET_SLUG, COSMIC_READ_KEY, COSMIC_WRITE_KEY)
4. Deploy

### Netlify
1. Push your code to GitHub
2. Import the repository on [Netlify](https://netlify.com)
3. Set build command: `bun run build`
4. Set publish directory: `.next`
5. Add environment variables
6. Deploy
<!-- README_END -->