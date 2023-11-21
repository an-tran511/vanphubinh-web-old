import { ICategory } from '@utils/intefaces'
import { client } from './client'

export const getCategories = async () => {
  const response = await client.url('/categories').get()
  return response as ICategory[]
}
