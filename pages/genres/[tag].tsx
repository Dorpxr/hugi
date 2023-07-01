import { TagSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { databaseId } from '@/lib/notion/client'
import { getAllPostsFrontMatter } from '@/lib/notion/operations'
import kebabCase from '@/lib/utils/kebabCase'

export async function getServerSideProps({ params, res }) {
  res.setHeader('Cache-Control', 'public, s-maxage=3300, stale-while-revalidate=3300')
  const allPosts = await getAllPostsFrontMatter(databaseId)
  const filteredPosts = allPosts.filter(
    (post) => post.status === 'Done' && post.tags.map((t) => kebabCase(t)).includes(params.tag)
  )

  return { props: { posts: filteredPosts, tag: params.tag } }
}

export default function Tag({ posts, tag }) {
  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  return (
    <>
      <TagSEO
        title={`${tag} - ${siteMetadata.author}`}
        description={`${tag} tags - ${siteMetadata.author}`}
      />
      <ListLayout posts={posts} title={title} initialDisplayPosts={posts} pagination={null} />
    </>
  )
}
