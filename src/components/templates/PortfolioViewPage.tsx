'use client'

import React, { useEffect, useState } from 'react'
import { Box, Heading, Text, Flex, Image, VStack, Link, Icon, Button } from '@chakra-ui/react'
import { FaGithub, FaBlog } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { PortfolioViewPageProps } from '@/types/data'
import PortfolioMainImageText from '../organisms/PortfolioMainImageText'
import PortfolioNavBar from '../organisms/PortfolioNavBar'
import ProjectInformation from '../organisms/ProjectInformation'
import SkillCategories from '../organisms/SkillCategories'
import Footer from '../organisms/Footer'
import MarkdownModal from '../organisms/MarkdownModal'

const PortfolioViewPage: React.FC<PortfolioViewPageProps> = ({ portfolioData, userData }) => {
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
            <Box
              w={['90%', '70%', '70%']}
              borderWidth="1px"
              borderRadius="md"
              p={4}
              bg="white"
              shadow="md"
              key={project.id}
            >
              <Heading fontSize="xl" my={[3, 5, 5]}>
                {project.name}
              </Heading>
              <Flex direction={['column', 'row']}>
                <Box w={['100%', '50%']}>
                  <Image src={project.image} alt={project.name} mb={4} />
                </Box>
                <Box w={['100%', '50%', '50%']}>
                  <Text mb={10} textAlign="left">
                    {project.description}
                  </Text>
                  <ProjectInformation
                    startDate={project.startDate}
                    endDate={project.endDate}
                    githubLink={project.githubLink}
                    skills={categorizedProjectSkill[index]}
                  />
                  {project.readmeFile && (
                    <Box w={['100%', '50%', '50%']} marginRight="auto">
                      <Button
                        onClick={() => {
                          setSelectedProjectMdFile(project.readmeFile)
                          openProjectModal()
                        }}
                      >
                        자세히 보기
                      </Button>
                    </Box>
                  )}
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
