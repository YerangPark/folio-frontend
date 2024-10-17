'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PortfolioViewPage from '@/components/templates/PortfolioViewPage'
import isTokenExpired from '@/utils/TokenExpiredChecker'

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://yrpark.duckdns.org:8080'

  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token')
      router.push('/')
      return
    }

    const fetchPortfolioData = async () => {
      const url = `${apiUrl}/api/portfolio/${id}`
      const headers: Record<string, string> = {}
      headers.Authorization = `Bearer ${token}`

      const response = await fetch(url, {
        method: 'GET',
        headers,
      })

      const res = await response.json()
      if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/')
        return
      }

      if (response.ok) {
        const portfolio = res.data
        setPortfolioData({
          portfolioName: portfolio.file_name,
          title: portfolio.title,
          description: portfolio.description,
          githubLink: portfolio.github_link,
          blogLink: portfolio.blog_link,
          image: `${apiUrl}/uploads/${portfolio.image}`,
          skills: portfolio.portfolioSkills.map((skill: any) => skill.skill_id),
          // eslint-disable-next-line no-underscore-dangle
          projects: portfolio.__projects__.map((project: any) => ({
            id: project.id,
            name: project.name,
            description: project.description,
            githubLink: project.github_link,
            siteLink: project.site_link,
            startDate: project.start_date ? project.start_date.split('-').slice(0, 2).join('-') : '',
            endDate: project.end_date ? project.end_date.split('-').slice(0, 2).join('-') : '',
            image: project.image ? `${apiUrl}/uploads/${project.image}` : null,
            readmeFile: project.readme_file ? `${apiUrl}/uploads/${project.readme_file}` : null,
            skills: project.projectSkills.map((skill: any) => skill.skill_id),
          })),
        })
      }
    }

    const fetchUserData = async () => {
      const url = `${apiUrl}/api/user`
      const headers: Record<string, string> = {}
      headers.Authorization = `Bearer ${token}`

      const response = await fetch(url, {
        method: 'GET',
        headers,
      })

      const res = await response.json()
      if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/')
        return
      }

      if (response.ok) {
        const user = res.data
        setUserData({
          name: user.name,
          email: user.email,
          birthdate: user.birthdate,
        })
      }
    }

    const fetchData = async () => {
      await fetchPortfolioData()
      await fetchUserData()
      setLoading(false) // 데이터가 모두 로드되면 로딩을 종료합니다.
    }

    fetchData()
  }, [id, router, apiUrl])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!portfolioData || !userData) {
    return <div>포트폴리오 데이터를 불러올 수 없습니다.</div>
  }

  return <PortfolioViewPage portfolioData={portfolioData} userData={userData} />
}
