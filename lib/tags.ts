import { getAllPostsFrontMatter } from '@/lib/notion/getOps'
import kebabCase from '@/lib/utils/kebabCase'
import { databaseId } from './notion/client'

export async function getAllTags() {
  const posts = await getAllPostsFrontMatter(databaseId)
  let tagCount = {}
  // Iterate through each post, putting all found tags into `tags`
  posts.forEach((post) => {
    if (post.tags && post.status !== 'Draft') {
      post.tags.forEach((tag) => {
        const formattedTag = kebabCase(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })

  return tagCount
}
