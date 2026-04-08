import Link from 'next/link'
import { Category } from '@/types'
import { getMetafieldValue } from '@/lib/cosmic'

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const name = getMetafieldValue(category.metadata?.name) || category.title
  const description = getMetafieldValue(category.metadata?.description)

  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <div className="h-full relative rounded-xl p-8 bg-carbon-900 border border-carbon-800 hover:border-racing-600/50 transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-racing-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10">
          <div className="w-14 h-14 rounded-xl bg-racing-600/10 flex items-center justify-center mb-5">
            <svg className="w-7 h-7 text-racing-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-racing-400 transition-colors">
            {name}
          </h3>
          {description && (
            <p className="text-carbon-400 text-sm leading-relaxed line-clamp-3">{description}</p>
          )}
          <div className="mt-5 flex items-center gap-1 text-racing-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View Articles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}