import type { Metadata } from 'next'
import { getAuthors } from '@/lib/cosmic'
import AuthorCard from '@/components/AuthorCard'

export const metadata: Metadata = {
  title: 'Authors | Sports Car Blog',
  description: 'Meet the writers and automotive enthusiasts behind our sports car blog.'
}

export default async function AuthorsPage() {
  const authors = await getAuthors()

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Page Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 bg-racing-600/10 border border-racing-600/20 rounded-full px-4 py-2 mb-6">
          <span className="text-racing-400 text-sm font-medium uppercase tracking-wider">Team</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          Our Authors
        </h1>
        <p className="text-xl text-carbon-400 max-w-2xl">
          Meet the passionate automotive enthusiasts and writers who bring you the best sports car stories.
        </p>
      </div>

      {/* Authors Grid */}
      {authors.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {authors.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">👤</span>
          <h2 className="text-2xl font-bold text-white mb-2">No Authors Yet</h2>
          <p className="text-carbon-400">Author profiles will appear here once added.</p>
        </div>
      )}
    </div>
  )
}