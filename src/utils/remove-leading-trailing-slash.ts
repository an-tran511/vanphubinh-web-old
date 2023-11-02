export const removeLeadingTrailingSlashes = (route: string) => {
  return route.replace(/^\/|\/$/g, '')
}
