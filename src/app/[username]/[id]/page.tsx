import PortfolioViewPage from '@/components/templates/PortfolioViewPage'
import { Portfolio } from '@/types/data'

export default async function Page({ params }: { params: { username: string; id: string } }) {
  const { username, id } = params
  if (Array.isArray(id) || !id || Array.isArray(username) || !username) {
    return <div>올바르지 않은 접근입니다.</div>
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://yrpark.duckdns.org:8080'

  const getPortfolioData = async (): Promise<Portfolio | null> => {
    const url = `${apiUrl}/api/${username}/${id}`
    const headers: Record<string, string> = {}

    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    const res = await response.json()
    if (response.ok) {
      const portfolio = res.data

      // API에서 얻은 데이터를 포트폴리오 state에 저장
      return {
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
      }
    }
    console.error('포트폴리오 불러오기 실패:', res.message)
    return null
  }

  const getUserData = async () => {
    const url = `${apiUrl}/api/user/public/${username}`
    const headers: Record<string, string> = {}

    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    const res = await response.json()
    if (response.ok) {
      const user = res.data
      return {
        name: user.name,
        email: user.email,
        birthdate: user.birthdate,
      }
    }
    console.error('포트폴리오 불러오기 실패:', res.message)
    return null
  }

  const portfolioData = await getPortfolioData()
  const userData = await getUserData()

  if (!portfolioData || !userData) {
    return <div>포트폴리오 데이터를 불러올 수 없습니다.</div>
  }

  return <PortfolioViewPage portfolioData={portfolioData} userData={userData} />
}
