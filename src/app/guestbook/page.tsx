'use client'

import GuestbookPage from '@/components/templates/GuestbookPage'
import isTokenExpired from '@/utils/TokenExpiredChecker'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token')
      router.push('/')
    }
  }, [router])

  return <GuestbookPage />
}
