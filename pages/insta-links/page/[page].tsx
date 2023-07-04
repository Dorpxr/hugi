import { PageSEO } from '@/components/SEO'
import { getAllPostsFrontMatter } from '@/lib/notion/operations'
import { POSTS_PER_PAGE } from '../../insta-links'
import { databaseId } from '@/lib/notion/client'
import { GetServerSideProps } from 'next'
import InstaLinksLayout from '@/layouts/InstaLinksLayout'
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
      initialDisplayPosts,
      pagination,
    },
  }
}

export default function InstaLinksPage({ initialDisplayPosts, pagination }) {
  return (
    <>
      <PageSEO title={`Instragram Links`} description={`Instagram links to stories and poems`} />
      <InstaLinksLayout initialDisplayPosts={initialDisplayPosts} pagination={pagination} />
    </>
  )
}
