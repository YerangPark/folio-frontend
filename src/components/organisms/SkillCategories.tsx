import React from 'react'
import { Box, Heading, Flex, Text, VStack, Divider } from '@chakra-ui/react'

interface SkillCategoriesProps {
  skills: Record<string, string[]>
}

const SkillCategories: React.FC<SkillCategoriesProps> = ({ skills }) => {
  if (!skills) {
    return <Text>Loading...</Text>
  }
  return (
    <Box width="full" textAlign="start" p={6} w={['90%', '70%', '70%']}>
      <VStack spacing={6} align="stretch">
        {/* 카테고리별로 반복 */}
        {Object.entries(skills).map(([category, skillNames]) => (
          <Box key={category} p={4} borderRadius="md" bg="brand.primary2">
            <Heading as="h3" size="md" mb={4} textAlign="left" color="brand.text2">
              {category.charAt(0).toUpperCase() + category.slice(1)} {/* 카테고리 이름 */}
            </Heading>
            <Divider color="brand.text2" mb={4} />
            <Flex wrap="wrap" gap={4} justify="flex-start">
              {/* 스킬 이름만 표시 */}
              {skillNames.map((skill) => (
                <Text key={skill} fontSize="lg" color="brand.text2">
                  {skill}
                </Text>
              ))}
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}

export default SkillCategories
