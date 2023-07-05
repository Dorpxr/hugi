import { PageSEO } from '@/components/SEO'
import { getAllPostsFrontMatter } from '@/lib/notion/operations'
import { POSTS_PER_PAGE } from '../../insta-links'
import { databaseId } from '@/lib/notion/client'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import InstaLinksLayout from '@/layouts/InstaLinksLayout'
import { DEFAULT_CACHE_CONTROL } from '@/lib/constants'
import { PageMetaData } from '@/lib/stories/interfaces/page-metadata.interface'

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPostsFrontMatter(databaseId)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }))

  return {
    paths,
    fallback: false,
  }
}

type Props = {
  initialDisplayPosts: PageMetaData[]
  pagination: {
    currentPage: number
    totalPages: number
  }
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
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
    revalidate: DEFAULT_CACHE_CONTROL['24'],
  }
}

export default function InstaLinksPage({
  initialDisplayPosts,
  pagination,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO title={`Instragram Links`} description={`Instagram links to stories and poems`} />
      <InstaLinksLayout initialDisplayPosts={initialDisplayPosts} pagination={pagination} />
    </>
  )
}
