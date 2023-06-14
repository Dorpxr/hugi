export default function SectionContainer({ children }) {
  return (
    <div className="md mx-auto max-w-3xl overflow-x-hidden overflow-y-visible px-4 sm:px-6 md:overflow-x-visible xl:max-w-5xl xl:px-0">
      {children}
    </div>
  )
}
