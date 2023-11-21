import React from 'react'
import ReactDOM from 'react-dom/client'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dates/styles.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Center, createTheme, MantineProvider, Loader } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspensive, SuspensiveProvider } from '@suspensive/react'
import { Root } from '@routes/root'
import { ItemList, ItemCreate } from '@routes/items'
import { SalesOrderList, SalesOrderCreate } from '@routes/sales-orders'
import { PartnerList } from '@routes/partners'
import { WarehouseList } from '@routes/warehouses'
import { LocationList } from '@routes/locations'

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
        children: [
          {
            index: true,
            element: <ItemList />
          },
          {
            path: 'create',
            element: <ItemCreate />
          }
        ]
      },
      {
        path: 'sales-orders',
        children: [
          {
            path: '',
            element: <SalesOrderList />
          },
          {
            path: 'create',
            element: <SalesOrderCreate />
          }
        ]
      },
      {
        path: 'partners',
        children: [
          {
            path: '',
            element: <PartnerList />
          }
        ]
      },
      {
        path: 'warehouses',
        children: [
          {
            path: '',
            element: <WarehouseList />
          }
        ]
      },
      {
        path: 'locations',
        children: [
          {
            path: '',
            element: <LocationList />
          }
        ]
      }
    ]
  }
])

const theme = createTheme({
  primaryColor: 'blue'
})
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
          <Notifications />
          <RouterProvider router={router} />
        </MantineProvider>
      </QueryClientProvider>
    </SuspensiveProvider>
  </React.StrictMode>
)
