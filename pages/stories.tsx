import { GetStaticProps, InferGetStaticPropsType } from 'next'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'
import { getAllPostsFrontMatter } from '@/lib/notion/operations'
import { databaseId } from '@/lib/notion/client'
import { PageMetaData } from '@/lib/stories/interfaces/page-metadata.interface'
import { DEFAULT_CACHE_CONTROL } from '@/lib/constants'

export const POSTS_PER_PAGE = 6

type Props = {
  posts: PageMetaData[]
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
    props: { initialDisplayPosts, posts, pagination, revalidate: DEFAULT_CACHE_CONTROL['24'] },
  }
}

export default function Recipes({
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
