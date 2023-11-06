import wretch from 'wretch'
import FormDataAddon from 'wretch/addons/formData'
import QueryStringAddon from 'wretch/addons/queryString'

export const client = wretch(import.meta.env.VITE_API_BASE_URL, { mode: 'cors' })
  .errorType('json')
  .resolve((r) => r.json())
  .addon(FormDataAddon)
  .addon(QueryStringAddon)
