import Link from 'next/link'
import { Post } from '@/types'
import { getMetafieldValue } from '@/lib/cosmic'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const featuredImage = post.metadata?.featured_image
  const category = post.metadata?.category
  const author = post.metadata?.author
  const tags = getMetafieldValue(post.metadata?.tags)

  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <article className="h-full rounded-xl overflow-hidden bg-carbon-900 border border-carbon-800 hover:border-carbon-700 transition-all duration-300 flex flex-col">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {featuredImage ? (
            <img
              src={`${featuredImage.imgix_url}?w=800&h=500&fit=crop&auto=format,compress`}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              width={400}
              height={250}
            />
          ) : (
            <div className="w-full h-full bg-carbon-800 flex items-center justify-center">
              <span className="text-4xl">🏎️</span>
            </div>
          )}
          {category && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-racing-600/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
              {getMetafieldValue(category.metadata?.name) || category.title}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-white mb-3 group-hover:text-racing-400 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Tags */}
          {tags && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags
                .split(',')
                .filter(Boolean)
                .slice(0, 3)
                .map((tag) => (
                  <span
                    key={tag.trim()}
                    className="px-2 py-0.5 bg-carbon-800 text-carbon-400 text-xs rounded"
                  >
                    {tag.trim()}
                  </span>
                ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-3 mt-auto pt-4 border-t border-carbon-800">
            {author?.metadata?.photo ? (
              <img
                src={`${author.metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                alt={getMetafieldValue(author.metadata?.name) || author.title}
                className="w-8 h-8 rounded-full object-cover"
                width={32}
                height={32}
              />
            ) : author ? (
              <div className="w-8 h-8 rounded-full bg-carbon-800 flex items-center justify-center">
                <span className="text-xs">👤</span>
              </div>
            ) : null}
            <div className="flex-1 min-w-0">
              {author && (
                <p className="text-xs text-carbon-300 font-medium truncate">
                  {getMetafieldValue(author.metadata?.name) || author.title}
                </p>
              )}
              <p className="text-xs text-carbon-500">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}