import Link from '@/components/Link'

type Props = {
  totalPages: number
  currentPage: number
  linkBasePath: string
}

export default function Pagination({ totalPages, currentPage, linkBasePath }: Props) {
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button rel="previous" className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Prev
          </button>
        )}
        {prevPage && (
          <Link
            href={
              currentPage - 1 === 1 ? `${linkBasePath}/` : `${linkBasePath}/page/${currentPage - 1}`
            }
          >
            <button rel="previous">Prev</button>
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button rel="next" className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`${linkBasePath}/page/${currentPage + 1}`}>
            <button rel="next">Next</button>
          </Link>
        )}
      </nav>
    </div>
  )
}
