// app/posts/[slug]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getPosts, getMetafieldValue } from '@/lib/cosmic'

interface PageProps {
  params: Promise<{ slug: string }>
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function getExcerpt(html: string, maxLength = 160): string {
  const text = stripHtml(html)
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…'
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  const tags = getMetafieldValue(post.metadata?.tags)
  const content = getMetafieldValue(post.metadata?.content)
  const author = post.metadata?.author
  const featuredImage = post.metadata?.featured_image

  const tagList = tags
    ? tags.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  const description = content
    ? getExcerpt(content)
    : `Read "${post.title}" on Sports Car Blog.`

  const authorName = author
    ? getMetafieldValue(author.metadata?.name) || author.title
    : undefined

  const imageUrl = featuredImage
    ? `${featuredImage.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`
    : undefined

  return {
    title: `${post.title} | Sports Car Blog`,
    description,
    keywords: tagList.length > 0 ? tagList : undefined,
    authors: authorName ? [{ name: authorName }] : undefined,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.created_at,
      authors: authorName ? [authorName] : undefined,
      tags: tagList.length > 0 ? tagList : undefined,
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      }),
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: post.title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  }
}

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const content = getMetafieldValue(post.metadata?.content)
  const tags = getMetafieldValue(post.metadata?.tags)
  const author = post.metadata?.author
  const category = post.metadata?.category
  const featuredImage = post.metadata?.featured_image

  // Structured data (JSON-LD) for search engines
  const tagList = tags
    ? tags.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  const authorName = author
    ? getMetafieldValue(author.metadata?.name) || author.title
    : undefined

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.created_at,
    ...(authorName && {
      author: {
        '@type': 'Person',
        name: authorName,
      },
    }),
    ...(featuredImage && {
      image: `${featuredImage.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`,
    }),
    ...(tagList.length > 0 && { keywords: tagList.join(', ') }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        {/* Hero */}
        <div className="relative min-h-[50vh] flex items-end overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/80 to-carbon-950/40 z-10" />
          {featuredImage ? (
            <img
              src={`${featuredImage.imgix_url}?w=1920&h=1080&fit=crop&auto=format,compress&q=70`}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
              width={1920}
              height={1080}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-carbon-900 to-carbon-950" />
          )}
          <div className="relative z-20 max-w-4xl mx-auto px-6 pb-12 pt-32 w-full">
            <div className="flex items-center gap-3 mb-6">
              {category && (
                <Link
                  href={`/categories/${category.slug}`}
                  className="inline-flex items-center px-3 py-1 bg-racing-600/20 text-racing-400 text-sm font-semibold rounded-full hover:bg-racing-600/30 transition-colors"
                >
                  {getMetafieldValue(category.metadata?.name) || category.title}
                </Link>
              )}
              <span className="text-carbon-500 text-sm">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
              {post.title}
            </h1>
          </div>
        </div>

        {/* Author bar */}
        {author && (
          <div className="max-w-4xl mx-auto px-6 py-8 border-b border-carbon-800">
            <Link href={`/authors/${author.slug}`} className="inline-flex items-center gap-4 group">
              {author.metadata?.photo ? (
                <img
                  src={`${author.metadata.photo.imgix_url}?w=100&h=100&fit=crop&auto=format,compress`}
                  alt={getMetafieldValue(author.metadata?.name) || author.title}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-carbon-700 group-hover:ring-racing-600 transition-all"
                  width={48}
                  height={48}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-carbon-800 flex items-center justify-center ring-2 ring-carbon-700 group-hover:ring-racing-600 transition-all">
                  <span className="text-lg">👤</span>
                </div>
              )}
              <div>
                <p className="text-white font-semibold group-hover:text-racing-400 transition-colors">
                  {getMetafieldValue(author.metadata?.name) || author.title}
                </p>
                {author.metadata?.bio && (
                  <p className="text-carbon-400 text-sm line-clamp-1">
                    {getMetafieldValue(author.metadata.bio)}
                  </p>
                )}
              </div>
            </Link>
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          {content ? (
            <div
              className="prose-content text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-carbon-400 text-lg">No content available for this post.</p>
          )}

          {/* Tags */}
          {tags && (
            <div className="mt-12 pt-8 border-t border-carbon-800">
              <h3 className="text-sm font-semibold text-carbon-400 uppercase tracking-wider mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags
                  .split(',')
                  .filter(Boolean)
                  .map((tag) => (
                    <span
                      key={tag.trim()}
                      className="px-4 py-2 bg-carbon-900 text-carbon-300 text-sm rounded-lg border border-carbon-800"
                    >
                      {tag.trim()}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-carbon-800">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 text-racing-400 hover:text-racing-300 font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to All Articles
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}