import React, { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Image, Input } from '@chakra-ui/react'

interface InputImageProps {
  formLabel: string
  image: File | string | null
  alt: string
  onImageChange: (img: File | null) => void
  buttonLabel: string
}

const InputImage: React.FC<InputImageProps> = ({ formLabel, image, alt, onImageChange, buttonLabel }) => {
  const [fileName, setFileName] = useState('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageChange(file) // 파일 객체를 콜백으로 전달
      setFileName(file.name) // 파일 이름을 저장
    } else {
      onImageChange(null) // 파일이 없을 경우 null 전달
    }
  }
  const uniqueId = `image-upload-${Math.random().toString(36).substring(2, 9)}`

  return (
    <FormControl mb={4}>
      <Box display="flex" alignItems="center">
        <FormLabel mb="0" width={[110, 130, 150]}>
          {formLabel}
        </FormLabel>
        <Box display="flex" alignItems="center">
          {image && (
            <Image
              src={image instanceof File ? URL.createObjectURL(image) : image} // 파일 객체를 URL로 변환하여 이미지 미리보기
              alt={alt}
              boxSize={[100, 130, 150]}
              mr={4}
            />
          )}
          <Button as="label" htmlFor={uniqueId} variant="outline" mr={4}>
            {buttonLabel}
          </Button>
          <Input type="file" id={uniqueId} accept="image/*" hidden onChange={handleImageChange} />
          <Box>{fileName}</Box> {/* 업로드한 파일 이름 표시 */}
        </Box>
      </Box>
    </FormControl>
  )
}

export default InputImage
