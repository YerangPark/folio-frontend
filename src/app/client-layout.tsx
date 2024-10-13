'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { fetchSkills } from '@/features/skill/skillSlice'
import store, { AppDispatch } from '@/store'
import theme from '../theme'

function ClientComponentWrapper({ children }: { children: React.ReactNode }) {
  const dispatch: AppDispatch = useDispatch()
  const didFetchRef = useRef(false) // NOTE: 재랜더링해도 값이 저장되는 useRef를 이용해서 최초 1번 실행

  useEffect(() => {
    if (!didFetchRef.current) {
      dispatch(fetchSkills())
      didFetchRef.current = true
    }
  }, [dispatch])

  return children
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ClientComponentWrapper>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </ClientComponentWrapper>
    </Provider>
  )
}
