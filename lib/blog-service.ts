import { BlogPost } from '@/types/blog'

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.itfixer199.com'
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function fetchBlogs(): Promise<BlogPost[]> {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/api/blog/`

  try {
    console.log('📡 [Server Blog Service] Requesting:', url)
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    })

    console.log('📡 [Server Blog Service] Status:', res.status)

    if (res.ok) {
      const data = await res.json()
      console.log('📡 [Server Blog Service] Raw Response:', data)
      const list: BlogPost[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : []

      return list
    }
  } catch (error) {
    console.error('❌ [Server Blog Service] Error fetching blogs:', error)
  }

  return []
}

export async function fetchBlogByIdOrSlug(idOrSlug: string): Promise<BlogPost | null> {
  const baseUrl = getBaseUrl()

  // 1. If valid UUID, attempt direct fetch from API
  if (UUID_REGEX.test(idOrSlug)) {
    try {
      const res = await fetch(`${baseUrl}/api/blog/${idOrSlug}/`, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (res.ok) {
        const json = await res.json()
        const blogData = json.data || json
        if (blogData && (blogData.id || blogData.title)) {
          return blogData
        }
      }
    } catch (error) {
      console.error(`❌ [Server Blog Service] Error fetching by UUID ${idOrSlug}:`, error)
    }
  }

  // 2. Fallback: Search all blogs by url_slug or id
  try {
    const blogs = await fetchBlogs()
    const matched = blogs.find(
      (b) => b.url_slug === idOrSlug || b.id === idOrSlug
    )

    if (matched) {
      return matched
    }
  } catch (error) {
    console.error(`❌ [Server Blog Service] Error searching fallback:`, error)
  }

  return null
}
