import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllPostsFrontMatter } from '@/lib/notion/operations'
import ListLayout from '@/layouts/ListLayout'
import { POSTS_PER_PAGE } from '../../stories'
import { databaseId } from '@/lib/notion/client'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
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
  posts: PageMetaData[]
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
      posts,
      initialDisplayPosts,
      pagination,
    },
    revalidate: DEFAULT_CACHE_CONTROL['24'],
  }
}

export default function PostPage({
  posts,
  initialDisplayPosts,
  pagination,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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
