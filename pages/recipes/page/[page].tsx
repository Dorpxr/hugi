import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { databaseId } from '@/lib/notion/client'
import { getDatabase } from '@/lib/notion/getOps'
import ListLayout from '@/layouts/ListLayout'

export async function getStaticPaths() {
  const totalPosts = await getDatabase(databaseId)
  const totalPages = Math.ceil(totalPosts.length / 10)
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: {
      page: (i + 1).toString(),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params: { page } }) {
  const posts = await getDatabase(databaseId)
  const pageNumber = parseInt(page)
  const initialDisplayPosts = posts.slice(10 * (pageNumber - 1), 10 * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / 10),
  }
  return {
    props: {
      posts,
      initialDisplayPosts,
      pagination,
    },
  }
}

export default function PostPage({ posts, initialDisplayPosts, pagination }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </>
  )
}
