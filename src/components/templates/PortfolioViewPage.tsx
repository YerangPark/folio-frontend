import React, { useEffect, useState } from 'react'
import { Box, Heading, Text, Flex, Image, VStack, Link, Icon, Button } from '@chakra-ui/react'
import { FaGithub, FaBlog } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import PortfolioMainImageText from '../organisms/PortfolioMainImageText'
import PortfolioNavBar from '../organisms/PortfolioNavBar'
import ProjectInformation from '../organisms/ProjectInformation'
import SkillCategories from '../organisms/SkillCategories'
import Footer from '../organisms/Footer'
import MarkdownModal from '../organisms/MarkdownModal'

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://yrpark.duckdns.org:8080'

const PortfolioViewPage: React.FC<{ username?: string; id: number; isPublic?: boolean }> = ({
  username,
  id,
  isPublic = false,
}) => {
  const router = useRouter()
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [userData, setUserData] = useState<{ name: string; birthdate: string; email: string }>({
    name: '',
    birthdate: '',
    email: '',
  })
  const reduxSkills = useSelector((state: RootState) => state.skill.skills)
  const [categorizedSkill, setCategorizedSkill] = useState<any>(null)
  const [categorizedProjectSkill, setCategorizedProjectSkill] = useState<any>([])
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [selectedProjectMdFile, setSelectedProjectMdFile] = useState('')
  const closeProjectModal = () => {
    setProjectModalOpen(false)
  }
  const openProjectModal = () => {
    setProjectModalOpen(true)
  }

  const groupPortfolioSkillsByCategory = (skillIds: number[], skillDefines: any[]) => {
    return skillIds.reduce(
      (acc, skillId) => {
        const skill = skillDefines.find((s) => s.id === skillId)

        if (skill) {
          const { category } = skill
          return {
            ...acc,
            [category]: acc[category] ? [...acc[category], skill.name] : [skill.name], // 불변성을 유지
          }
        }

        return acc
      },
      {} as Record<string, string[]>,
    )
  }

  const getPortfolioData = async () => {
    const token = localStorage.getItem('token')
    if (!token && !isPublic) {
      console.error('토큰이 만료되었습니다.')
      router.push('/')
      throw new Error('Token not found')
    }

    const url = isPublic ? `${apiUrl}/api/${username}/${id}` : `${apiUrl}/api/portfolio/${id}`
    const headers: Record<string, string> = {}
    if (!isPublic) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    const res = await response.json()
    if (response.status === 401) {
      console.error('토큰이 만료되었습니다.')
      localStorage.removeItem('token')
      router.push('/')
    }

    if (response.ok) {
      const portfolio = res.data

      // API에서 얻은 데이터를 포트폴리오 state에 저장
      setPortfolioData({
        portfolioName: portfolio.file_name,
        title: portfolio.title,
        description: portfolio.description,
        githubLink: portfolio.github_link,
        blogLink: portfolio.blog_link,
        image: portfolio.image ? `${apiUrl}/uploads/${portfolio.image}` : null,
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
    } else {
      console.error('포트폴리오 불러오기 실패:', res.message)
    }
  }

  const getUserData = async () => {
    const token = localStorage.getItem('token')
    if (!token && !isPublic) {
      console.error('토큰이 만료되었습니다.')
      router.push('/')
      throw new Error('Token not found')
    }

    const url = isPublic ? `${apiUrl}/api/user/public/${username}` : `${apiUrl}/api/user`
    const headers: Record<string, string> = {}
    if (!isPublic) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    const res = await response.json()
    if (response.status === 401) {
      console.error('토큰이 만료되었습니다.')
      localStorage.removeItem('token')
      router.push('/')
    }

    if (response.ok) {
      const user = res.data
      setUserData({
        name: user.name,
        email: user.email,
        birthdate: user.birthdate,
      })
    } else {
      console.error('포트폴리오 불러오기 실패:', res.message)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getPortfolioData()
      await getUserData()
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (portfolioData) {
      setCategorizedSkill(groupPortfolioSkillsByCategory(portfolioData.skills, reduxSkills))
      const tmp = portfolioData.projects.map((project: any) =>
        groupPortfolioSkillsByCategory(project.skills, reduxSkills),
      )
      setCategorizedProjectSkill(tmp)
    }
  }, [portfolioData])

  if (!portfolioData) {
    return <Text>Loading...</Text>
  }

  return (
    <Box width="full">
      {/* 헤더 섹션 */}
      <Box mb={100}>
        <PortfolioNavBar title={portfolioData.title} />
        <PortfolioMainImageText image={portfolioData.image} text={portfolioData.description} />
      </Box>

      {/* ABOUT ME 섹션 */}
      <Box textAlign="center" mb={100}>
        <Heading fontSize="4xl" mb={4}>
          ABOUT ME
        </Heading>
        <Flex justify="center" gap={10} mb={6}>
          <VStack>
            <Text fontSize="sm">이름</Text>
            <Text fontWeight="bold">{userData.name}</Text>
          </VStack>
          <VStack>
            <Text fontSize="sm">생년월일</Text>
            <Text fontWeight="bold">{userData.birthdate}</Text>
          </VStack>
          <VStack>
            <Text fontSize="sm">이메일</Text>
            <Text fontWeight="bold">{userData.email}</Text>
          </VStack>
        </Flex>
        <Flex justify="center" gap={5}>
          <Link href={portfolioData.githubLink} isExternal>
            <Icon as={FaGithub} w={6} h={6} />
            <Text fontSize="sm">Github</Text>
          </Link>
          <Link href={portfolioData.blogLink} isExternal>
            <Icon as={FaBlog} w={6} h={6} />
            <Text fontSize="sm">블로그</Text>
          </Link>
        </Flex>
      </Box>

      {/* SKILLS 섹션 */}
      <Box textAlign="center" mb={100}>
        <Heading fontSize="4xl" mb={6}>
          SKILLS
        </Heading>
        <Flex justify="center" flexWrap="wrap" gap={6}>
          <SkillCategories skills={categorizedSkill} />
        </Flex>
      </Box>

      {/* PROJECTS 섹션 */}
      <Box textAlign="center" mb={100}>
        <Heading fontSize="4xl" mb={10}>
          PROJECTS
        </Heading>
        <VStack gap={8}>
          {portfolioData.projects.map((project: any, index: number) => (
            <Box w="90%" borderWidth="1px" borderRadius="md" p={4} bg="white" shadow="md" key={project.id}>
              <Flex>
                <Box w="50%">
                  <Image src={project.image} alt={project.name} mb={4} />
                </Box>
                <Box w="50%">
                  <Heading fontSize="xl" my={10}>
                    {project.name}
                  </Heading>
                  <Text mb={10} textAlign="left">
                    {project.description}
                  </Text>
                  <ProjectInformation
                    startDate={project.startDate}
                    endDate={project.endDate}
                    githubLink={project.githubLink}
                    skills={categorizedProjectSkill[index]}
                  />
                  <Box w="100%" marginRight="auto">
                    <Button
                      onClick={() => {
                        setSelectedProjectMdFile(project.readmeFile)
                        openProjectModal()
                      }}
                    >
                      자세히 보기
                    </Button>
                  </Box>
                </Box>
              </Flex>
              <Flex wrap="wrap" gap={2} mb={4}>
                {/* {project.skills.map((tech: string) => (
                  <Text key={tech} bg="gray.100" p={1} borderRadius="md">{tech}</Text>
                ))} */}
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
      <Footer />
      <MarkdownModal isOpen={projectModalOpen} onClose={closeProjectModal} mdFilePath={selectedProjectMdFile} />
    </Box>
  )
}

export default PortfolioViewPage
