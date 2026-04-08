import Link from 'next/link'
import { getPosts, getCategories } from '@/lib/cosmic'
import { getMetafieldValue } from '@/lib/cosmic'
import PostCard from '@/components/PostCard'

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    getPosts(),
    getCategories()
  ])

  const featuredPost = posts[0]
  const recentPosts = posts.slice(1, 7)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-carbon-950 via-carbon-900/90 to-carbon-950" />
        {featuredPost?.metadata?.featured_image && (
          <img
            src={`${featuredPost.metadata.featured_image.imgix_url}?w=1920&h=1080&fit=crop&auto=format,compress&q=60`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            width={1920}
            height={1080}
          />
        )}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-racing-600/20 border border-racing-600/30 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-racing-500 rounded-full animate-pulse" />
            <span className="text-racing-400 text-sm font-medium tracking-wide uppercase">
              Sports Car Blog
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            The Art of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-racing-400 to-racing-600">
              Speed
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-carbon-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stories, reviews, and the passion behind the world&apos;s most thrilling sports cars.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/posts"
              className="inline-flex items-center justify-center px-8 py-4 bg-racing-600 hover:bg-racing-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-racing-600/25 hover:shadow-racing-600/40"
            >
              Read Articles
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center px-8 py-4 bg-carbon-800 hover:bg-carbon-700 text-white font-semibold rounded-lg transition-all duration-200 border border-carbon-700"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-8 bg-racing-600 rounded-full" />
            <h2 className="text-3xl font-bold text-white">Featured Story</h2>
          </div>
          <Link href={`/posts/${featuredPost.slug}`} className="group block">
            <div className="relative rounded-2xl overflow-hidden bg-carbon-900 border border-carbon-800 hover:border-carbon-700 transition-all duration-300">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                  {featuredPost.metadata?.featured_image ? (
                    <img
                      src={`${featuredPost.metadata.featured_image.imgix_url}?w=1200&h=800&fit=crop&auto=format,compress`}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      width={600}
                      height={400}
                    />
                  ) : (
                    <div className="w-full h-full min-h-[300px] bg-carbon-800 flex items-center justify-center">
                      <span className="text-6xl">🏎️</span>
                    </div>
                  )}
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  {featuredPost.metadata?.category && (
                    <span className="inline-block text-racing-400 text-sm font-semibold uppercase tracking-wider mb-4">
                      {getMetafieldValue(featuredPost.metadata.category.metadata?.name) || featuredPost.metadata.category.title}
                    </span>
                  )}
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-racing-400 transition-colors">
                    {featuredPost.title}
                  </h3>
                  {featuredPost.metadata?.tags && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {getMetafieldValue(featuredPost.metadata.tags)
                        .split(',')
                        .filter(Boolean)
                        .slice(0, 3)
                        .map((tag) => (
                          <span
                            key={tag.trim()}
                            className="px-3 py-1 bg-carbon-800 text-carbon-300 text-xs rounded-full"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-auto">
                    {featuredPost.metadata?.author?.metadata?.photo && (
                      <img
                        src={`${featuredPost.metadata.author.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                        alt={getMetafieldValue(featuredPost.metadata.author.metadata?.name) || featuredPost.metadata.author.title}
                        className="w-10 h-10 rounded-full object-cover"
                        width={40}
                        height={40}
                      />
                    )}
                    <div>
                      {featuredPost.metadata?.author && (
                        <p className="text-sm text-white font-medium">
                          {getMetafieldValue(featuredPost.metadata.author.metadata?.name) || featuredPost.metadata.author.title}
                        </p>
                      )}
                      <p className="text-xs text-carbon-400">
                        {new Date(featuredPost.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-racing-600 rounded-full" />
              <h2 className="text-3xl font-bold text-white">Latest Articles</h2>
            </div>
            <Link
              href="/posts"
              className="text-racing-400 hover:text-racing-300 font-medium transition-colors flex items-center gap-1"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-racing-600 rounded-full" />
              <h2 className="text-3xl font-bold text-white">Explore Categories</h2>
            </div>
            <Link
              href="/categories"
              className="text-racing-400 hover:text-racing-300 font-medium transition-colors flex items-center gap-1"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative p-8 rounded-xl bg-carbon-900 border border-carbon-800 hover:border-racing-600/50 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-racing-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-racing-600/10 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-racing-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-racing-400 transition-colors">
                    {getMetafieldValue(category.metadata?.name) || category.title}
                  </h3>
                  {category.metadata?.description && (
                    <p className="text-carbon-400 text-sm line-clamp-2">
                      {getMetafieldValue(category.metadata.description)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-racing-700 to-racing-900 p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2Mmgtdnp6bS00IDRoMnYyaC0ydi0yem0yLTJ2MmgtMnYtMmgyem0tNi02aDJ2MmgtMnYtMnptNCAyaC0ydi0yaDJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Passion for Performance
            </h2>
            <p className="text-lg text-racing-100/80 max-w-xl mx-auto mb-8">
              From legendary supercars to the latest track beasts, dive into stories that fuel your automotive passion.
            </p>
            <Link
              href="/posts"
              className="inline-flex items-center px-8 py-4 bg-white text-racing-700 font-semibold rounded-lg hover:bg-racing-50 transition-colors shadow-lg"
            >
              Start Reading
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}