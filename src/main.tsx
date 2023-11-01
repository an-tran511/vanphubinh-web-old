import React from 'react'
import ReactDOM from 'react-dom/client'
import '@mantine/core/styles.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createTheme, MantineProvider } from '@mantine/core'
import { Root, RootErrorPage } from '@routes/root'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <RootErrorPage />
  }
])

const theme = createTheme({})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
)
