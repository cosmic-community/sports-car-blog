// app/categories/[slug]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCategoryBySlug, getCategories, getPostsByCategory, getMetafieldValue } from '@/lib/cosmic'
import PostCard from '@/components/PostCard'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return { title: 'Category Not Found' }
  }

  const name = getMetafieldValue(category.metadata?.name) || category.title
  return {
    title: `${name} | Sports Car Blog`,
    description: getMetafieldValue(category.metadata?.description) || `Browse articles in the "${name}" category on Sports Car Blog.`
  }
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((cat) => ({ slug: cat.slug }))
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const posts = await getPostsByCategory(category.id)
  const name = getMetafieldValue(category.metadata?.name) || category.title
  const description = getMetafieldValue(category.metadata?.description)

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Category Header */}
      <div className="mb-16">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-carbon-400 hover:text-racing-400 font-medium transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          All Categories
        </Link>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-racing-600/10 flex items-center justify-center">
            <svg className="w-7 h-7 text-racing-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white">{name}</h1>
            <p className="text-carbon-500 text-sm mt-1">
              {posts.length} {posts.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </div>
        {description && (
          <p className="text-lg text-carbon-300 max-w-2xl mt-4">{description}</p>
        )}
      </div>

      {/* Posts */}
      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">📝</span>
          <h2 className="text-2xl font-bold text-white mb-2">No Articles Yet</h2>
          <p className="text-carbon-400">
            There are no articles in this category yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  )
}