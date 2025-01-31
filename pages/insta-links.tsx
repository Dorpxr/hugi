import { PageSEO } from '@/components/SEO'
import InstaLinksLayout from '@/layouts/InstaLinksLayout'
import { DEFAULT_CACHE_CONTROL } from '@/lib/constants'
import { databaseId } from '@/lib/notion/client'
import { getAllPostsFrontMatter } from '@/lib/notion/operations'
import { PageMetaData } from '@/lib/stories/interfaces/page-metadata.interface'
import { GetStaticProps, InferGetStaticPropsType } from 'next'

export const POSTS_PER_PAGE = 15

type Props = {
  initialDisplayPosts: PageMetaData[]
  pagination: {
    currentPage: number
    totalPages: number
  }
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = await getAllPostsFrontMatter(databaseId)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return {
    props: {
      initialDisplayPosts,
      pagination,
    },
    revalidate: DEFAULT_CACHE_CONTROL['24'],
  }
}

export default function InstaLinks({
  initialDisplayPosts,
  pagination,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO title={`Instagram Links`} description={`Instagram links to stories and poems`} />
      <InstaLinksLayout initialDisplayPosts={initialDisplayPosts} pagination={pagination} />
    </>
  )
}
