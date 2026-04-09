import { createBucketClient } from '@cosmicjs/sdk'
import { Post, Author, Category, hasStatus } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging'
})

export function getMetafieldValue(field: unknown): string {
  if (field === null || field === undefined) return ''
  if (typeof field === 'string') return field
  if (typeof field === 'number' || typeof field === 'boolean') return String(field)
  if (Array.isArray(field)) return field.join(', ')
  if (typeof field === 'object' && field !== null && 'value' in field) {
    return String((field as { value: unknown }).value)
  }
  if (typeof field === 'object' && field !== null && 'key' in field) {
    return String((field as { key: unknown }).key)
  }
  return ''
}

/**
 * Handles multi-select fields that return arrays, or comma-separated strings.
 * Always returns a string array.
 */
export function getTagsArray(field: unknown): string[] {
  if (field === null || field === undefined) return []
  if (Array.isArray(field)) return field.map(String).filter(Boolean)
  if (typeof field === 'string') {
    return field.split(',').map(t => t.trim()).filter(Boolean)
  }
  return []
}

/**
 * Simple markdown to HTML parser.
 * Handles headings, bold, italic, links, images, code blocks, inline code,
 * blockquotes, unordered/ordered lists, horizontal rules, tables, and paragraphs.
 */
export function parseMarkdown(md: string): string {
  if (!md) return ''

  let html = md

  // Code blocks (fenced)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return `<pre><code class="language-${lang}">${escaped.trim()}</code></pre>`
  })

  // Tables
  html = html.replace(/((?:^\|.+\|\s*$\n?)+)/gm, (tableBlock) => {
    const rows = tableBlock.trim().split('\n').filter(r => r.trim())
    if (rows.length < 2) return tableBlock

    const parseRow = (row: string) =>
      row.split('|').slice(1, -1).map(cell => cell.trim())

    // Check if second row is a separator
    const separatorRow = parseRow(rows[1])
    const isSeparator = separatorRow.every(cell => /^[:\-]+$/.test(cell))
    if (!isSeparator) return tableBlock

    const headerCells = parseRow(rows[0])
    let tableHtml = '<table><thead><tr>'
    headerCells.forEach(cell => { tableHtml += `<th>${cell}</th>` })
    tableHtml += '</tr></thead><tbody>'

    for (let i = 2; i < rows.length; i++) {
      const cells = parseRow(rows[i])
      tableHtml += '<tr>'
      cells.forEach(cell => { tableHtml += `<td>${cell}</td>` })
      tableHtml += '</tr>'
    }
    tableHtml += '</tbody></table>'
    return tableHtml
  })

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
  // Merge adjacent blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n')

  // Headings
  html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>')
  html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>')
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  // Horizontal rules
  html = html.replace(/^(---+|\*\*\*+|___+)$/gm, '<hr />')

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  // Bold + italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Unordered lists
  html = html.replace(/(^[\-\*] .+$\n?)+/gm, (block) => {
    const items = block.trim().split('\n').map(line =>
      `<li>${line.replace(/^[\-\*] /, '')}</li>`
    ).join('')
    return `<ul>${items}</ul>`
  })

  // Ordered lists
  html = html.replace(/(^\d+\. .+$\n?)+/gm, (block) => {
    const items = block.trim().split('\n').map(line =>
      `<li>${line.replace(/^\d+\. /, '')}</li>`
    ).join('')
    return `<ol>${items}</ol>`
  })

  // Paragraphs: wrap remaining plain text lines
  html = html.split('\n\n').map(block => {
    const trimmed = block.trim()
    if (!trimmed) return ''
    // Don't wrap blocks that already start with HTML tags
    if (/^<(h[1-6]|p|ul|ol|li|blockquote|pre|table|hr|div|img)/.test(trimmed)) {
      return trimmed
    }
    return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`
  }).join('\n')

  return html
}

// Posts
export async function getPosts(): Promise<Post[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'posts' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'type'])
      .depth(1)

    const posts = (response.objects || []) as Post[]
    return posts.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch posts')
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'posts', slug })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'type'])
      .depth(1)

    return (response.object || null) as Post | null
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch post')
  }
}

export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'posts', 'metadata.author': authorId })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'type'])
      .depth(1)

    const posts = (response.objects || []) as Post[]
    return posts.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch posts by author')
  }
}

export async function getPostsByCategory(categoryId: string): Promise<Post[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'posts', 'metadata.category': categoryId })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'type'])
      .depth(1)

    const posts = (response.objects || []) as Post[]
    return posts.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch posts by category')
  }
}

// Authors
export async function getAuthors(): Promise<Author[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'authors' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'type'])
      .depth(1)

    return (response.objects || []) as Author[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch authors')
  }
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'authors', slug })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'type'])
      .depth(1)

    return (response.object || null) as Author | null
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch author')
  }
}

// Categories
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'type'])
      .depth(1)

    return (response.objects || []) as Category[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch categories')
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'categories', slug })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'type'])
      .depth(1)

    return (response.object || null) as Category | null
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch category')
  }
}