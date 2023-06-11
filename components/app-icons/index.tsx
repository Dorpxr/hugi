import Clock from './clock.svg'

// Icons taken from: https://heroicons.com/

const components = {
  clock: Clock,
}

const AppIcon = ({ kind, size = 8 }) => {
  const AppSvg = components[kind]

  return (
    <>
      <span className="sr-only">{kind}</span>
      <AppSvg className={`h-${size} w-${size}`} />
    </>
  )
}

export default AppIcon
