'use client'

import React, { useEffect, useState } from 'react'
import { Box, Divider } from '@chakra-ui/react'
import { Project } from '@/types/data'
import { useRouter } from 'next/navigation'
import DashboardNavBar from '../organisms/DashboardNavBar'
import { Heading } from '../atoms/Text'
import PortfolioInputForm from '../organisms/PortfolioInputForm'
import PortfolioInputFooter from '../molecules/PortfolioInputFooter'
import ProjectInputForm from '../organisms/ProjectInputForm'

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://yrpark.duckdns.org:8080'

interface PortfolioFormPageProps {
  id?: number
}

const PortfolioFormPage: React.FC<PortfolioFormPageProps> = ({ id }) => {
  const isEditMode = !!id

  const [page, setPage] = useState(0)
  const nextPage = () => {
    setPage(1)
  }
  const prevPage = () => {
    setPage(0)
  }
  const router = useRouter()

  // First Page States
  const [portfolioName, setPortfolioName] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | string | null>(null) // 이미지 파일로 변경
  const [githubLink, setGithubLink] = useState('')
  const [blogLink, setBlogLink] = useState('')
  const [selectedTechStack, setSelectedTechStack] = useState<number[]>([])

  // Project Page States
  const [projects, setProjects] = useState<Project[]>([])

  const checkRequiredFields = () => {
    const missingFields: string[] = []

    // Portfolio 필수 필드 체크
    if (!portfolioName) missingFields.push('포트폴리오 이름')
    if (!title) missingFields.push('제목')
    if (!description) missingFields.push('설명')

    // Project 필수 필드 체크
    projects.forEach((project, index) => {
      if (!project.name) missingFields.push(`프로젝트 ${index + 1}의 이름`)
      if (!project.description) missingFields.push(`프로젝트 ${index + 1}의 설명`)
      if (!project.startDate) missingFields.push(`프로젝트 ${index + 1}의 시작 날짜`)
      if (!project.endDate) missingFields.push(`프로젝트 ${index + 1}의 종료 날짜`)
    })

    return missingFields
  }

  const getPortfolioData = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      throw new Error('Token not found')
    }

    const response = await fetch(`${apiUrl}/api/portfolio/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const res = await response.json()
    if (response.status === 401) {
      console.error('토큰이 만료되었습니다.')
      localStorage.removeItem('token')
      router.push('/')
    }

    if (response.ok) {
      const portfolio = res.data
      setPortfolioName(portfolio.file_name)
      setTitle(portfolio.title)
      setDescription(portfolio.description)
      setGithubLink(portfolio.github_link)
      setBlogLink(portfolio.blog_link)
      setImageFile(`${apiUrl}/uploads/${portfolio.image}`)
      const skillIds = portfolio.portfolioSkills.map((skill: any) => skill.skill_id)
      setSelectedTechStack(skillIds)

      // eslint-disable-next-line no-underscore-dangle
      const fetchedProjects = portfolio.__projects__.map((project: any) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        githubLink: project.github_link,
        siteLink: project.site_link,
        startDate: project.start_date ? project.start_date.split('-').slice(0, 2).join('-') : '', // 날짜 값이 없을 때 빈 문자열 반환
        endDate: project.end_date ? project.end_date.split('-').slice(0, 2).join('-') : '', // 날짜 값이 없을 때 빈 문자열 반환
        image: `${apiUrl}/uploads/${project.image}`, // 이미지는 서버에서 반환된 파일 경로
        readmeFile: project.readme_file, // README 파일 경로
        selectedTechStack: project.projectSkills ? project.projectSkills.map((skill: any) => skill.skill_id) : [],
      }))

      setProjects(fetchedProjects)
      console.log(res.data)
    } else {
      console.error('포트폴리오 불러오기 실패:', res.message)
    }
  }

  const updatePortfolio = async (token: any, formData: any) => {
    const response = await fetch(`${apiUrl}/api/portfolio/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const res = await response.json()
    if (response.status === 401) {
      console.error('토큰이 만료되었습니다.')
      localStorage.removeItem('token')
      router.push('/')
    }

    if (response.ok) {
      console.log('포트폴리오 저장 성공:', res)
      router.push('/dashboard')
    } else {
      console.error('포트폴리오 저장 실패:', res.message)
    }
  }

  const createPortfolio = async (token: any, formData: any) => {
    const response = await fetch(`${apiUrl}/api/portfolio`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const res = await response.json()
    if (response.status === 401) {
      console.error('토큰이 만료되었습니다.')
      localStorage.removeItem('token')
      router.push('/')
    }

    if (response.ok) {
      console.log('포트폴리오 저장 성공:', res)
      router.push('/dashboard')
    } else {
      console.error('포트폴리오 저장 실패:', res.message)
    }
  }

  const handleSubmit = async () => {
    const missingFields = checkRequiredFields()

    if (missingFields.length > 0) {
      alert(`다음 필드를 작성해야 합니다: \n${missingFields.join(', ')}`)
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/')
        throw new Error('Token not found')
      }

      const formData = new FormData()
      formData.append('file_name', portfolioName)
      formData.append('title', title)
      formData.append('description', description)

      // 이미지 파일이 있을 경우 추가
      if (imageFile) {
        formData.append('image', imageFile) // "image"는 서버에서 처리할 필드 이름
      }

      formData.append('github_link', githubLink)
      formData.append('blog_link', blogLink)
      formData.append('skills', JSON.stringify(selectedTechStack))
      console.log(JSON.stringify(selectedTechStack))

      // 프로젝트 정보와 파일 처리
      projects.forEach((project, index) => {
        formData.append(`projects[${index}][id]`, project.id.toString())
        formData.append(`projects[${index}][name]`, project.name)
        formData.append(`projects[${index}][description]`, project.description)
        formData.append(`projects[${index}][github_link]`, project.githubLink)
        formData.append(`projects[${index}][site_link]`, project.siteLink)
        formData.append(`projects[${index}][start_date]`, `${project.startDate}-01`)
        formData.append(`projects[${index}][end_date]`, `${project.endDate}-01`)
        formData.append(`projects[${index}][skills]`, JSON.stringify(project.selectedTechStack))

        // 프로젝트 이미지 파일이 있을 경우 추가
        if (project.image instanceof File) {
          formData.append(`projects[${index}][image]`, project.image) // 개별 프로젝트 이미지
        }

        // 프로젝트 README 파일이 있을 경우 추가
        if (project.readmeFile) {
          formData.append(`projects[${index}][readme_file]`, project.readmeFile)
        }
      })

      if (isEditMode) {
        updatePortfolio(token, formData)
      } else {
        createPortfolio(token, formData)
      }
    } catch (error) {
      console.error('에러 발생:', error)
    }
  }

  useEffect(() => {
    if (isEditMode) {
      getPortfolioData()
    }
  }, [])

  return (
    <div>
      <DashboardNavBar />
      <hr />
      <Box mx="10" mt="5">
        {isEditMode ? (
          <Heading content="포트폴리오 수정" fontSize="2xl" color="brand.text1" />
        ) : (
          <Heading content="포트폴리오 생성" fontSize="2xl" color="brand.text1" />
        )}
        {page === 0 ? (
          <Box>
            <PortfolioInputForm
              portfolioName={portfolioName}
              setPortfolioName={setPortfolioName}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              image={imageFile}
              setImage={setImageFile} // 이미지 파일로 변경
              githubLink={githubLink}
              setGithubLink={setGithubLink}
              blogLink={blogLink}
              setBlogLink={setBlogLink}
              selectedTechStack={selectedTechStack}
              setSelectedTechStack={setSelectedTechStack}
            />
            <Divider />
            <PortfolioInputFooter showNextButton onNextClick={nextPage} />
          </Box>
        ) : (
          <Box>
            <ProjectInputForm projects={projects} setProjects={setProjects} />
            <Divider />
            <PortfolioInputFooter showPrevButton onPrevClick={prevPage} showSaveButton onSaveClick={handleSubmit} />
          </Box>
        )}
      </Box>
    </div>
  )
}

export default PortfolioFormPage
