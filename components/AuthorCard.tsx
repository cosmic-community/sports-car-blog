import Link from 'next/link'
import { Author } from '@/types'
import { getMetafieldValue } from '@/lib/cosmic'

interface AuthorCardProps {
  author: Author
}

export default function AuthorCard({ author }: AuthorCardProps) {
  const name = getMetafieldValue(author.metadata?.name) || author.title
  const bio = getMetafieldValue(author.metadata?.bio)
  const photo = author.metadata?.photo
  const socialLink = getMetafieldValue(author.metadata?.social_link)

  return (
    <Link href={`/authors/${author.slug}`} className="group block">
      <div className="h-full rounded-xl bg-carbon-900 border border-carbon-800 hover:border-carbon-700 p-8 transition-all duration-300 text-center">
        {photo ? (
          <img
            src={`${photo.imgix_url}?w=300&h=300&fit=crop&auto=format,compress`}
            alt={name}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-5 ring-4 ring-carbon-800 group-hover:ring-racing-600/50 transition-all duration-300"
            width={96}
            height={96}
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-carbon-800 flex items-center justify-center mx-auto mb-5 ring-4 ring-carbon-700 group-hover:ring-racing-600/50 transition-all duration-300">
            <span className="text-3xl">👤</span>
          </div>
        )}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-racing-400 transition-colors">
          {name}
        </h3>
        {bio && (
          <p className="text-carbon-400 text-sm line-clamp-3 mb-4 leading-relaxed">{bio}</p>
        )}
        {socialLink && (
          <span className="inline-flex items-center gap-1 text-racing-400 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Social
          </span>
        )}
      </div>
    </Link>
  )
}