import { TagSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { DEFAULT_CACHE_CONTROL } from '@/lib/constants'
import { databaseId } from '@/lib/notion/client'
import { getAllPostsFrontMatter } from '@/lib/notion/operations'
import { PageMetaData } from '@/lib/stories/interfaces/page-metadata.interface'
import { getAllTags } from '@/lib/tags'
import kebabCase from '@/lib/utils/kebabCase'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = await getAllTags()
  return {
    paths: Object.keys(tags).map((tag) => ({
      params: {
        tag,
      },
    })),
    fallback: false,
  }
}

type Props = {
  posts: PageMetaData[]
  tag: string
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const allPosts = await getAllPostsFrontMatter(databaseId)
  const filteredPosts = allPosts.filter(
    (post) => post.status === 'Done' && post.tags.map((t) => kebabCase(t)).includes(params.tag)
  )

  return {
    props: { posts: filteredPosts, tag: params.tag as string },
    revalidate: DEFAULT_CACHE_CONTROL['24'],
  }
}

export default function Tag({ posts, tag }: InferGetStaticPropsType<typeof getStaticProps>) {
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
