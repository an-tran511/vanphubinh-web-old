import { GetResponse, IItem } from '@utils/intefaces'
import { client } from './client'

export const getItems = async ({ page, searchValue }: { page?: number; searchValue?: string }) => {
  const response = await client.url('/items').query({ page: page, searchValue: searchValue }).get()
  return response as GetResponse<IItem>
}
