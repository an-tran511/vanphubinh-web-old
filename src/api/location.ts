import { ILocation } from '@utils/intefaces'
import { client } from './client'

export const getLocations = async () => {
  const response = await client.url('/locations').get()
  return response as ILocation[]
}
