import React, { useState } from 'react'
import { Flex, FormControl, FormLabel, Input, Button, Icon, InputGroup, InputRightElement } from '@chakra-ui/react'
import { FiFilePlus } from 'react-icons/fi'

interface InputFileProps {
  formLabel: string
  placeholder?: string
  onFileChange: (file: File | null) => void
  allowedExtensions: string[] // 허용된 파일 확장자
}

const InputFile: React.FC<InputFileProps> = ({ formLabel, placeholder, onFileChange, allowedExtensions }) => {
  const [fileName, setFileName] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileExtension = file.name.split('.').pop() // 파일 확장자 추출
      if (allowedExtensions.includes(fileExtension || '')) {
        setFileName(file.name)
        onFileChange(file)
      } else {
        alert(`허용된 파일 확장자는: ${allowedExtensions.join(', ')} 입니다.`) // FIXME: 에러 메세지로 수정
        setFileName('')
        onFileChange(null)
      }
    }
  }

  const uniqueId = `file-upload-${Math.random().toString(36).substring(2, 9)}`

  return (
    <FormControl mb={4}>
      <Flex align="center">
        <FormLabel mb="0" width={[110, 130, 150]}>
          {formLabel}
        </FormLabel>
        <InputGroup width="100%" flex="1">
          <Input
            placeholder={placeholder}
            value={fileName}
            isReadOnly
            _hover={{ cursor: 'default' }}
            _focus={{ boxShadow: 'none' }}
            pointerEvents="none"
          />
          <InputRightElement width="5rem">
            <Button
              as="label"
              htmlFor={uniqueId}
              leftIcon={<Icon as={FiFilePlus} />}
              size="sm"
              variant="outline"
              cursor="pointer"
            >
              추가
            </Button>
            <Input id={uniqueId} type="file" onChange={handleFileChange} hidden />
          </InputRightElement>
        </InputGroup>
      </Flex>
    </FormControl>
  )
}

export default InputFile
