'use client'

import PortfolioViewPage from '@/components/templates/PortfolioViewPage'
import { useParams } from 'next/navigation'

export default function Page() {
  const params = useParams()
  if (Array.isArray(params.id) || !params.id || Array.isArray(params.username) || !params.username) {
    return <div>올바르지 않은 접근입니다.</div>
  }
  const { username } = params
  const id = parseInt(params.id, 10)

  return <PortfolioViewPage username={username} id={id} isPublic />
}
