// app/authors/[slug]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAuthorBySlug, getAuthors, getPostsByAuthor, getMetafieldValue } from '@/lib/cosmic'
import PostCard from '@/components/PostCard'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)

  if (!author) {
    return { title: 'Author Not Found' }
  }

  const name = getMetafieldValue(author.metadata?.name) || author.title
  return {
    title: `${name} | Sports Car Blog`,
    description: getMetafieldValue(author.metadata?.bio) || `Read articles by ${name} on Sports Car Blog.`
  }
}

export async function generateStaticParams() {
  const authors = await getAuthors()
  return authors.map((author) => ({ slug: author.slug }))
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)

  if (!author) {
    notFound()
  }

  const posts = await getPostsByAuthor(author.id)
  const name = getMetafieldValue(author.metadata?.name) || author.title
  const bio = getMetafieldValue(author.metadata?.bio)
  const socialLink = getMetafieldValue(author.metadata?.social_link)
  const photo = author.metadata?.photo

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Author Profile */}
      <div className="mb-16">
        <Link
          href="/authors"
          className="inline-flex items-center gap-2 text-carbon-400 hover:text-racing-400 font-medium transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          All Authors
        </Link>
        <div className="flex flex-col md:flex-row items-start gap-8">
          {photo ? (
            <img
              src={`${photo.imgix_url}?w=400&h=400&fit=crop&auto=format,compress`}
              alt={name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover ring-4 ring-carbon-800"
              width={160}
              height={160}
            />
          ) : (
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-carbon-800 flex items-center justify-center ring-4 ring-carbon-700">
              <span className="text-5xl">👤</span>
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{name}</h1>
            {bio && (
              <p className="text-lg text-carbon-300 leading-relaxed max-w-2xl mb-6">{bio}</p>
            )}
            <div className="flex items-center gap-4">
              {socialLink && (
                <a
                  href={socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-carbon-800 hover:bg-carbon-700 text-white text-sm font-medium rounded-lg transition-colors border border-carbon-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Social Profile
                </a>
              )}
              <span className="text-carbon-500 text-sm">
                {posts.length} {posts.length === 1 ? 'article' : 'articles'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Author's Posts */}
      {posts.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-8 bg-racing-600 rounded-full" />
            <h2 className="text-3xl font-bold text-white">Articles by {name}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}