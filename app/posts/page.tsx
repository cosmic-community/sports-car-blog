import type { Metadata } from 'next'
import { getPosts } from '@/lib/cosmic'
import PostCard from '@/components/PostCard'

export const metadata: Metadata = {
  title: 'All Articles | Sports Car Blog',
  description: 'Browse all articles about sports cars, supercars, and high-performance automobiles.'
}

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Page Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 bg-racing-600/10 border border-racing-600/20 rounded-full px-4 py-2 mb-6">
          <span className="text-racing-400 text-sm font-medium uppercase tracking-wider">Blog</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          All Articles
        </h1>
        <p className="text-xl text-carbon-400 max-w-2xl">
          Explore our collection of stories, reviews, and insights about the world&apos;s most exciting sports cars.
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">🏎️</span>
          <h2 className="text-2xl font-bold text-white mb-2">No Articles Yet</h2>
          <p className="text-carbon-400">Check back soon for exciting sports car content.</p>
        </div>
      )}
    </div>
  )
}