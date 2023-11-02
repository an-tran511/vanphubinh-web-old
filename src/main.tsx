import React from 'react'
import ReactDOM from 'react-dom/client'
import '@mantine/core/styles.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Center, createTheme, MantineProvider } from '@mantine/core'
import { Root } from '@routes/root'
import { ItemList } from '@routes/items'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Loader } from '@mantine/core'
import { Suspensive, SuspensiveProvider } from '@suspensive/react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
      suspense: true,
      retry: 2
    }
  }
})

export type QueryClientType = typeof queryClient

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'items',
        element: <ItemList />
      },
      {
        path: 'items/create',
        element: <div>Create</div>
      }
    ]
  }
])

const theme = createTheme({})
const suspensive = new Suspensive({
  defaultOptions: {
    delay: {
      ms: 1200
    },
    suspense: {
      fallback: (
        <Center h='100%'>
          <Loader />
        </Center>
      )
    }
  }
})
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SuspensiveProvider value={suspensive}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <RouterProvider router={router} />
        </MantineProvider>
      </QueryClientProvider>
    </SuspensiveProvider>
  </React.StrictMode>
)
