export interface CosmicObject {
  id: string
  slug: string
  title: string
  content?: string
  metadata: Record<string, unknown>
  type: string
  created_at: string
  modified_at: string
}

export interface CosmicImage {
  url: string
  imgix_url: string
}

export interface Author extends CosmicObject {
  type: 'authors'
  metadata: {
    name?: string
    bio?: string
    photo?: CosmicImage
    social_link?: string
  }
}

export interface Category extends CosmicObject {
  type: 'categories'
  metadata: {
    name?: string
    description?: string
  }
}

export interface Post extends CosmicObject {
  type: 'posts'
  metadata: {
    content?: string
    featured_image?: CosmicImage
    tags?: string
    author?: Author
    category?: Category
  }
}

export interface CosmicResponse<T> {
  objects: T[]
  total: number
  limit: number
  skip: number
}

// Helper type guard
export function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error
}