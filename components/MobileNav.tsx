import { useEffect, useState, useRef } from 'react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'

const CLOSEEVENTNAME = 'CLICK_OUT_OF_MENU'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)

  const containerRef = useRef(null)

  const onToggleNav = () => {
    setNavShow((status) => {
      return !status
    })
  }

  useEffect(() => {
    const handleClickOutOfMenu = (e: Event) => {
      if (e.type === 'mouseup' && e.target === containerRef.current) {
        onToggleNav()
      }
    }
    containerRef.current.addEventListener('mouseup', handleClickOutOfMenu)

    return () => {
      containerRef.current.removeEventListener('mouseup', handleClickOutOfMenu)
    }
  }, [])

  return (
    <div className="sm:hidden">
      <button
        type="button"
        className="ml-1 mr-1 h-8 w-8 rounded py-1"
        aria-label="Toggle Menu"
        onClick={onToggleNav}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="text-gray-900 dark:text-gray-100"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        ref={containerRef}
        className={`fixed top-0 left-0 z-10 h-full w-full transform bg-gray-400/80 backdrop-blur-sm duration-300 ease-in-out dark:bg-gray-800/80 ${
          navShow ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="fixed top-0 right-0 z-20 m-4 flex w-full max-w-xs justify-between rounded-lg bg-white opacity-100 dark:bg-black">
          <nav className="h-full py-3">
            {headerNavLinks.map((link) => (
              <div key={link.title} className="py-3">
                <Link
                  href={link.href}
                  className="px-6 py-3 text-base font-bold tracking-wide text-gray-900 dark:text-gray-100"
                  onClick={onToggleNav}
                >
                  {link.title}
                </Link>
              </div>
            ))}
          </nav>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-6 mt-6 h-6 w-6 rounded"
              aria-label="Toggle Menu"
              onClick={onToggleNav}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="text-gray-900 dark:text-gray-100"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNav
