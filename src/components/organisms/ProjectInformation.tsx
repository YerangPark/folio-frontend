import { Box, Flex, Text } from '@chakra-ui/react'
import OutputDateRange from '../molecules/OutputDateRange'
import OutputLink from '../molecules/OutputLink'

interface ProjectInformationProps {
  startDate: string
  endDate: string
  githubLink?: string
  blogLink?: string
  skills?: Record<string, string[]>
}

const ProjectInformation: React.FC<ProjectInformationProps> = ({
  startDate,
  endDate,
  githubLink,
  blogLink,
  skills,
}) => {
  return (
    <>
      <OutputDateRange formLabel="> 개발 기간" startDate={startDate} endDate={endDate} />
      {githubLink && <OutputLink formLabel="> GitHub 주소" link={githubLink} />}
      {blogLink && <OutputLink formLabel="> 배포 주소" link={blogLink} />}

      {skills &&
        Object.entries(skills).map(([category, skillNames]) => (
          <Box key={category} mb={4}>
            <Flex align="center">
              <Text mb="0" width={[110, 130, 150]} fontWeight="bold" align="left">
                {'>'} {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
              <Flex wrap="wrap" gap={4} justify="flex-start">
                {Array.isArray(skillNames) ? (
                  skillNames.map((skill) => (
                    <Text key={skill} color="brand.text2">
                      {skill}
                    </Text>
                  ))
                ) : (
                  <Text fontSize="lg" color="red.500">
                    No skills available
                  </Text>
                )}
              </Flex>
            </Flex>
          </Box>
        ))}
    </>
  )
}

export default ProjectInformation
