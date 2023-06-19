import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'

export default function Shop() {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="flex w-full pt-20">
        <h1 className="w-full text-center text-3xl font-bold md:text-6xl">Shop Coming Soon </h1>
      </div>
    </>
  )
}
