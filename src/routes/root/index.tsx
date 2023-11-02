import { AppShell, Burger, Group } from '@mantine/core'
import { Avatar } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import { AsyncBoundary } from '@suspensive/react'

export const Root = () => {
  return (
    <AppShell header={{ height: 55 }} padding='md' h='100vh'>
      <AppShell.Header>
        <Group h='100%' px='md'>
          <Group justify='space-between' style={{ flex: 1 }}>
            <Burger style={{ padding: 0 }} />
            <Group>
              <Avatar color='cyan'>MK</Avatar>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main h='100%'>
        <AsyncBoundary
          rejectedFallback={(props) => (
            <>
              <button onClick={props.reset}>Try again</button>
              {props.error.message}
            </>
          )}
          onReset={() => console.log('reset')}
          onError={(error) => console.log(error)}
        >
          <Outlet />
        </AsyncBoundary>
      </AppShell.Main>
    </AppShell>
  )
}
