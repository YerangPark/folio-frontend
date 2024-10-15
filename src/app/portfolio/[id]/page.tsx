'use client'

import PortfolioViewPage from '@/components/templates/PortfolioViewPage'
import { useParams, useRouter } from 'next/navigation'
import isTokenExpired from '@/utils/TokenExpiredChecker'
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

  const params = useParams()
  if (Array.isArray(params.id) || !params.id) {
    return <div>올바르지 않은 접근입니다.</div>
  }
  const id = parseInt(params.id, 10)

  return <PortfolioViewPage id={id} />
}
