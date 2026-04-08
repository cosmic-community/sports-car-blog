import type { Metadata } from 'next'
import { getCategories } from '@/lib/cosmic'
import CategoryCard from '@/components/CategoryCard'

export const metadata: Metadata = {
  title: 'Categories | Sports Car Blog',
  description: 'Browse sports car content by category — supercars, track cars, classics, and more.'
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Page Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 bg-racing-600/10 border border-racing-600/20 rounded-full px-4 py-2 mb-6">
          <span className="text-racing-400 text-sm font-medium uppercase tracking-wider">Categories</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          Browse by Category
        </h1>
        <p className="text-xl text-carbon-400 max-w-2xl">
          Find articles organized by topic — from supercar reviews to racing news and everything in between.
        </p>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">🏷️</span>
          <h2 className="text-2xl font-bold text-white mb-2">No Categories Yet</h2>
          <p className="text-carbon-400">Categories will appear here once added.</p>
        </div>
      )}
    </div>
  )
}