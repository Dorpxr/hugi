export const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return `${hours ? `${hours}h` : ''} ${mins ? `${mins}m` : ''}`.trim()
}
