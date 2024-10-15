'use client'

import DashboardPage from '@/components/templates/DashboardPage'
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

  return <DashboardPage />
}
