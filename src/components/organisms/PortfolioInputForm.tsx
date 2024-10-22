import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Tag,
  Text,
  Divider,
  Wrap,
  WrapItem,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
  Icon,
  List,
  ListItem,
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { FiPlus, FiCheck } from 'react-icons/fi'
import { FaSearch } from 'react-icons/fa'
import { Skill } from '@/types/data'
import InformationBox from '../molecules/InformationBox'
import InputTextbox from '../molecules/InputTextbox'
import InputImage from '../molecules/InputImage'

const popularSkills: Skill[] = [
  { id: 1, name: 'Javascript' },
  { id: 12, name: 'React' },
  { id: 16, name: 'Next.js' },
  { id: 11, name: 'Spring' },
]

interface PortfolioInputFormProps {
  portfolioName: string
  setPortfolioName: (name: string) => void
  title: string
  setTitle: (title: string) => void
  description: string
  setDescription: (description: string) => void
  image: File | string | null
  setImage: (image: File | string | null) => void
  githubLink: string
  setGithubLink: (link: string) => void
  blogLink: string
  setBlogLink: (link: string) => void
  selectedTechStack: number[]
  setSelectedTechStack: (stack: number[]) => void
}

const PortfolioInputForm: React.FC<PortfolioInputFormProps> = ({
  portfolioName,
  setPortfolioName,
  title,
  setTitle,
  description,
  setDescription,
  image,
  setImage,
  githubLink,
  setGithubLink,
  blogLink,
  setBlogLink,
  selectedTechStack,
  setSelectedTechStack,
}) => {
  const skills = useSelector((state: RootState) => state.skill.skills)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Skill[]>([])

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    // 입력된 검색어가 있으면 필터링된 기술 스택을 보여주고, 없으면 검색 결과를 비움
    if (query) {
      const results = skills.filter((skill) => skill.name.toLowerCase().includes(query.toLowerCase()))
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleTechStackSelect = (val: string | number) => {
    const selectedId = typeof val === 'string' ? Number(val) : val
    if (selectedId && !selectedTechStack.includes(selectedId)) {
      setSelectedTechStack([...selectedTechStack, selectedId])
    }
  }

  const handleRemoveTechStack = (stackToRemove: number) => {
    setSelectedTechStack(selectedTechStack.filter((stack) => stack !== stackToRemove))
  }

  const handleSkillClick = (skillId: number) => {
    const alreadySelected = selectedTechStack.includes(skillId)
    if (alreadySelected) {
      setSelectedTechStack(selectedTechStack.filter((id) => id !== skillId))
    } else {
      setSelectedTechStack([...selectedTechStack, skillId])
    }
  }

  const renderSearchResults = () => {
    if (!searchQuery) {
      return null // 검색어가 없으면 아무 것도 렌더링하지 않음
    }

    if (searchResults.length > 0) {
      return (
        <List spacing={2} borderWidth="1px" borderRadius="md" p={4}>
          {searchResults.map((skill) => (
            <ListItem key={skill.id} onClick={() => handleTechStackSelect(skill.id)} cursor="pointer">
              {skill.name}
            </ListItem>
          ))}
        </List>
      )
    }

    return (
      <Box textAlign="center" p={4} borderWidth="1px" borderRadius="md">
        검색 결과가 없습니다.
      </Box>
    )
  }

  return (
    <Box px={[2, 4, 8]}>
      {/* 기본 설정 */}
      <Text fontSize="xl" fontWeight="bold" mt={3}>
        기본 설정
      </Text>
      <Divider my={2} />
      <InformationBox>· * 표시가 된 항목은 필수 입력 항목입니다.</InformationBox>

      <InputTextbox
        formLabel="포트폴리오 이름*"
        placeHolder="포트폴리오 이름을 입력하세요"
        value={portfolioName}
        onChange={setPortfolioName}
      />
      <InputTextbox formLabel="상부 타이틀*" placeHolder="상부 타이틀을 입력하세요" value={title} onChange={setTitle} />
      <InputTextbox
        formLabel="메인 소개글*"
        placeHolder="메인 소개글을 입력하세요"
        value={description}
        onChange={setDescription}
      />
      <InputImage
        formLabel="대표 사진*"
        image={image}
        alt="대표 사진 미리보기"
        onImageChange={setImage}
        buttonLabel="사진 추가"
      />
      {/* 임베드 링크 */}
      <Text fontSize="xl" fontWeight="bold" mt={20}>
        임베드 링크
      </Text>
      <Divider my={2} />
      <InformationBox>· 선택 입력사항입니다.</InformationBox>

      <InputTextbox
        formLabel="깃허브 링크"
        placeHolder="깃허브 링크를 입력하세요"
        value={githubLink}
        onChange={setGithubLink}
        maxLength={50}
      />
      <InputTextbox
        formLabel="블로그 링크"
        placeHolder="블로그 링크를 입력하세요"
        value={blogLink}
        onChange={setBlogLink}
        maxLength={50}
      />

      {/* 기술 스택 */}
      <Text fontSize="xl" fontWeight="bold" mt={20}>
        기술 스택
      </Text>
      <Divider mt={2} mb={4} />
      <InformationBox>
        · 이용자가 자주 사용하는 기술 스택입니다. 자신의 직무와 관련된 스킬을 추가해보세요.
        <br />· 필수 입력 항목입니다.
      </InformationBox>

      {/* 기술 스택 popular */}
      <Wrap spacing={4} mb={4}>
        {popularSkills.map((skill) => {
          const isSelected = selectedTechStack.includes(skill.id)
          return (
            <Button
              key={skill.id}
              variant="outline"
              borderRadius="full"
              borderColor={isSelected ? 'brand.primary1' : 'brand.background2'}
              color={isSelected ? 'brand.primary1' : 'brand.background2'}
              onClick={() => handleSkillClick(skill.id)}
              rightIcon={isSelected ? <FiCheck /> : <FiPlus />}
              fontWeight="normal"
              whiteSpace="nowrap"
              width="auto"
              px={[3, 4, 5]}
            >
              {skill.name}
            </Button>
          )
        })}
      </Wrap>

      {/* 기술 스택 검색 */}
      <FormControl mb={4}>
        <InputGroup>
          <Input placeholder="기술 스택을 검색해주세요" value={searchQuery} onChange={handleSearchInputChange} />
          <InputRightElement>
            <Icon as={FaSearch} color="gray.400" /> {/* 장식용 아이콘 */}
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Box mb={4}>{renderSearchResults()}</Box>

      {/* 선택된 항목 */}
      <FormControl mb={4}>
        <FormLabel>선택된 항목</FormLabel>
        <Box borderWidth="1px" borderRadius="md" p={4} textAlign={selectedTechStack.length === 0 ? 'center' : 'left'}>
          <Wrap>
            {selectedTechStack.length > 0 ? (
              selectedTechStack.map((stackId) => {
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
                      <TagCloseButton onClick={() => handleRemoveTechStack(stackId)} color="brand.primary1" />
                    </Tag>
                  </WrapItem>
                )
              })
            ) : (
              <Text color="gray.500">선택된 항목이 없습니다.</Text>
            )}
          </Wrap>
        </Box>
      </FormControl>
    </Box>
  )
}

export default PortfolioInputForm
