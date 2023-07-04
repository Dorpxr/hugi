import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllPostsFrontMatter } from '@/lib/notion/operations'
import ListLayout from '@/layouts/ListLayout'
import { POSTS_PER_PAGE } from '../../stories'
import { databaseId } from '@/lib/notion/client'
import { GetServerSideProps } from 'next'
import { DEFAULT_CACHE_CONTROL } from '@/lib/constants'

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    `public, s-maxage=${DEFAULT_CACHE_CONTROL.maxAge}, stale-while-revalidate=${DEFAULT_CACHE_CONTROL.swr}`
  )
  const {
    params: { page },
  } = context
  const posts = await getAllPostsFrontMatter(databaseId)
  const pageNumber = parseInt(page[0])
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
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
      <PageSEO title={`Stories`} description={siteMetadata.description} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Stories"
      />
    </>
  )
}
