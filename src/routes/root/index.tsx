import { AppShell, Burger, Group, Text, em } from '@mantine/core'
import { Avatar } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { AsyncBoundary } from '@suspensive/react'
import { Outlet } from 'react-router-dom'

export const Root = () => {
  const [opened, { toggle }] = useDisclosure()
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  return (
    // <AppShell header={{ height: 55 }} padding='sm' h='100vh'>
    //   <AppShell.Header
    //     style={{
    //       boxShadow: '0 1px 1px rgba(0,0,0,.1)'
    //     }}
    //   >
    //     <Group h='100%' px='md'>
    //       <Group justify='space-between' style={{ flex: 1 }}>
    //         <Burger style={{ padding: 0 }} />
    //         <Group>
    //           <Avatar color='cyan' radius='xl'>
    //             MK
    //           </Avatar>
    //         </Group>
    //       </Group>
    //     </Group>
    //   </AppShell.Header>

    //   <AppShell.Navbar p='md'>
    //     <Group>
    //       <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
    //       <Text>Navbar</Text>
    //     </Group>
    //     {Array(15)
    //       .fill(0)
    //       .map((_, index) => (
    //         <Skeleton key={index} h={28} mt='sm' animate={false} />
    //       ))}
    //   </AppShell.Navbar>

    //   <AppShell.Main h='100%'>
    //     <AsyncBoundary rejectedFallback={''}>
    //       <Outlet />
    //     </AsyncBoundary>
    //   </AppShell.Main>
    // </AppShell>
    <AppShell
      layout='alt'
      header={{ height: 60, collapsed: !isMobile }}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding='0'
    >
      <AppShell.Header>
        <Group h='100%' px='md'>
          <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p='md' withBorder bg='white'>
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
          <Text>Navbar</Text>
        </Group>
      </AppShell.Navbar>
      <AppShell.Main h='100dvh'>
        <AsyncBoundary rejectedFallback={''}>
          <Outlet />
        </AsyncBoundary>
      </AppShell.Main>
    </AppShell>
  )
}
