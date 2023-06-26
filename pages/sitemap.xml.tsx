import { generateSitemap } from '@/lib/generate-sitemap'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=3300, stale-while-revalidate=3300')
  const sitemap = await generateSitemap()
  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()
  return {
    props: {},
  }
}

export default function SiteMap() {
  // SSR getServerSideProps will generate sitemap
}
