import { SubLink } from '@/components/LinkSubnav'

export const subLinks: { key: string; subLinks: SubLink[] }[] = [
  {
    key: 'Browse',
    subLinks: [
      {
        text: 'Poems',
        href: '/genres/poem',
      },
      {
        text: 'Romance',
        href: '/genres/romance',
      },
      {
        text: 'Young Love',
        href: '/genres/young-love',
      },
      {
        text: 'Self Doubt',
        href: '/genres/self-doubt',
      },
      {
        text: 'Loss',
        href: '/genres/loss',
      },
      {
        text: 'Sci Fi',
        href: '/genres/sci-fi',
      },
      {
        text: 'Thriller',
        href: '/genres/thriller',
      },
    ],
  },
]
