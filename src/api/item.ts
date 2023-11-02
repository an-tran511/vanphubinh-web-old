export const getItems = async ({ page }: { page?: number }) => {
  await new Promise((res) => setTimeout(res, 1000))
  const response = await fetch('http://localhost:3333/api/items?page=' + page)
  return await response.json()
}
