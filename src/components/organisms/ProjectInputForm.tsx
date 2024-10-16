import React, { useState } from 'react'
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Wrap,
  WrapItem,
  IconButton,
} from '@chakra-ui/react'
import { FiPlus, FiDelete } from 'react-icons/fi'
import { Skill, ProjectInputProps } from '@/types/data'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { FaSearch } from 'react-icons/fa'
import InputImage from '../molecules/InputImage'
import InputTextbox from '../molecules/InputTextbox'
import InformationBox from '../molecules/InformationBox'
import InputDateRange from '../molecules/InputDateRange'
import InputFile from '../molecules/InputFile'

interface ProjectInputFormProps {
  projects: ProjectInputProps[]
  setProjects: React.Dispatch<React.SetStateAction<ProjectInputProps[]>>
}

const ProjectInputForm: React.FC<ProjectInputFormProps> = ({ projects, setProjects }) => {
  const skills = useSelector((state: RootState) => state.skill.skills)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Skill[]>([])

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query) {
      const results = skills.filter((skill) => skill.name.toLowerCase().includes(query.toLowerCase()))
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleTechStackSelect = (projectId: number, val: string | number) => {
    const selectedId = typeof val === 'string' ? Number(val) : val
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId && !project.selectedTechStack.includes(selectedId)
          ? { ...project, selectedTechStack: [...project.selectedTechStack, selectedId] }
          : project,
      ),
    )
  }

  const handleRemoveTechStack = (projectId: number, stackToRemove: number) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, selectedTechStack: project.selectedTechStack.filter((stack) => stack !== stackToRemove) }
          : project,
      ),
    )
  }

  const handleAddProject = () => {
    const newProject: ProjectInputProps = {
      id: projects.length + 1,
      name: '',
      description: '',
      image: null,
      githubLink: '',
      siteLink: '',
      startDate: '',
      endDate: '',
      selectedTechStack: [],
      readmeFile: null,
    }
    setProjects([...projects, newProject])
  }

  const handleRemoveProject = (projectId: number) => {
    const tmpProjects = projects.filter((project) => project.id !== projectId)
    setProjects(tmpProjects)
  }

  const handleFileChange = (projectId: number, file: File | null) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => (project.id === projectId ? { ...project, readmeFile: file } : project)),
    )
  }

  return (
    <Box px={8}>
      <Text fontSize="xl" fontWeight="bold" mt={3}>
        프로젝트
      </Text>
      <Divider my={2} />
      <InformationBox>
        · 프로젝트 경험을 작성해주세요.
        <br />
        {/* prettier-ignore */}
        · &quot;자세한 설명&quot;란은 자세히 보기 버튼을 눌렀을 때 보여질 내용입니다. 마크다운 언어로 작성하여&nbsp;
        첨부해주세요.
        <br />· * 표시가 된 항목은 필수 입력 항목입니다.
      </InformationBox>
      <Button
        leftIcon={<FiPlus />}
        aria-label="새로 만들기"
        size="sm"
        color="text2"
        bg="brand.background3"
        _hover={{ bg: 'brand.background2', color: 'white' }}
        onClick={handleAddProject}
        mb={5}
      >
        프로젝트 추가
      </Button>

      {projects.map((project) => (
        <Box key={project.id}>
          <Divider my={2} />
          <Box display="flex" justifyContent="flex-end" mb={5}>
            <IconButton
              icon={<FiDelete />}
              size="sm"
              aria-label="Delete Protject"
              color="text2"
              bg="brand.background3"
              _hover={{ bg: 'brand.background2', color: 'white' }}
              onClick={() => {
                handleRemoveProject(project.id)
              }}
            />
          </Box>
          <InputTextbox
            formLabel="프로젝트 명*"
            placeHolder=""
            value={project.name}
            onChange={(value) =>
              setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, name: value } : p)))
            }
          />
          <InputImage
            formLabel="대표 사진"
            image={project.image} // base64로 변환된 이미지를 받게 됨
            alt="대표 사진 미리보기"
            onImageChange={(image) =>
              setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, image } : p)))
            }
            buttonLabel="대표 사진 추가"
          />
          <InputDateRange
            formLabel="진행 기간*"
            startDate={project.startDate}
            endDate={project.endDate}
            onStartDateChange={(value) =>
              setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, startDate: value } : p)))
            }
            onEndDateChange={(value) =>
              setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, endDate: value } : p)))
            }
          />
          <InputTextbox
            formLabel="깃허브 URL"
            placeHolder=""
            value={project.githubLink}
            onChange={(value) =>
              setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, githubLink: value } : p)))
            }
          />
          <InputTextbox
            formLabel="사이트 URL"
            placeHolder=""
            value={project.siteLink}
            onChange={(value) =>
              setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, siteLink: value } : p)))
            }
          />
          <InputTextbox
            formLabel="메인 설명"
            placeHolder=""
            value={project.description}
            onChange={(value) =>
              setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, description: value } : p)))
            }
          />
          <FormControl mb={4}>
            <InputGroup>
              <FormLabel mb="0" width="150px">
                사용 기술 스택
              </FormLabel>
              <Input
                placeholder="기술 스택을 검색해주세요"
                value={searchQuery}
                onChange={handleSearchInputChange}
                flex="1"
              />
              <InputRightElement>
                <Icon as={FaSearch} color="brand.text4" />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Box mb={4}>
            <Flex align="center">
              <FormLabel mb="0" width={[110, 130, 150]} />
              {searchQuery &&
                (searchResults.length > 0 ? (
                  <List spacing={2} borderWidth="1px" borderRadius="md" p={4} width="100" flex="1">
                    {searchResults.map((skill) => (
                      <ListItem
                        key={skill.id}
                        onClick={() => handleTechStackSelect(project.id, skill.id)}
                        cursor="pointer"
                      >
                        {skill.name}
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box textAlign="center" p={4} borderWidth="1px" borderRadius="md" flex="1">
                    검색 결과가 없습니다.
                  </Box>
                ))}
            </Flex>
          </Box>

          <FormControl mb={4}>
            <Flex align="center">
              <FormLabel mb="0" width={[110, 130, 150]} />
              <Box
                borderWidth="1px"
                borderRadius="md"
                p={4}
                textAlign={project.selectedTechStack.length === 0 ? 'center' : 'left'}
                flex="1"
              >
                <Wrap>
                  {project.selectedTechStack.length > 0 ? (
                    project.selectedTechStack.map((stackId) => {
                      const skill = skills.find((s) => s.id === stackId)
                      return (
                        <WrapItem key={stackId} mr={2}>
                          <Tag
                            size="lg"
                            borderRadius="full"
                            variant="solid"
                            color="brand.text1"
                            bg="brand.primary2"
                            py={3}
                            px={5}
                            fontWeight="normal"
                          >
                            <TagLabel>{skill?.name}</TagLabel>
                            <TagCloseButton
                              onClick={() => handleRemoveTechStack(project.id, stackId)}
                              color="brand.primary1"
                            />
                          </Tag>
                        </WrapItem>
                      )
                    })
                  ) : (
                    <Text color="gray.500">선택된 항목이 없습니다.</Text>
                  )}
                </Wrap>
              </Box>
            </Flex>
          </FormControl>
          <InputFile
            formLabel="자세한 설명"
            placeholder={project.readmeFile ? '업로드된 md 파일이 있습니다' : '.md 파일을 추가해주세요'}
            onFileChange={(file: File | null) => handleFileChange(project.id, file)}
            allowedExtensions={['md']}
          />
        </Box>
      ))}
    </Box>
  )
}

export default ProjectInputForm
