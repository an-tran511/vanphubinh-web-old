import { ActionIcon, Box, Button, Card, Group, Stack, Text } from '@mantine/core'
import { ArrowLeft, StepBack } from 'lucide-react'
import { ReactNode } from 'react'

interface CreateProps {
  children: ReactNode
  title: string
}
export const Create = (props: CreateProps) => {
  const { children, title } = props
  return (
    <Stack gap='0' h='100%'>
      <Box
        p='md'
        bg='white'
        style={{
          borderBottom: '1px solid #e0e0e0',
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}
      >
        <Group justify='space-between'>
          <Group>
            <ActionIcon variant='default' aria-label='Back' size='lg'>
              <ArrowLeft style={{ width: '70%', height: '70%' }} strokeWidth='1.5' />
            </ActionIcon>
            <Stack gap='0'>
              <Text fw='500'>Tạo {title.toLowerCase()}</Text>
            </Stack>
          </Group>
          <Group>
            <Button variant='outline'>Lưu và tạo mới</Button>
            <Button>Lưu</Button>
          </Group>
        </Group>
      </Box>
      <Box py='md' px='md' h='100%'>
        {children}
      </Box>
    </Stack>
  )
}
