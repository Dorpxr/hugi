export const daysAgo = (days: number) => {
  const newDate = new Date(Date.now() - days * 86400000).toLocaleDateString('en-CA')
  return newDate
}
