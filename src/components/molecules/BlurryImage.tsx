import React from 'react'
import { Box } from '@chakra-ui/react'
import Image from '@/components/atoms/Image'

interface BlurryImageProps {
  src: string
  alt: string
  overlayOpacity?: number
  width?: string | number | (string | number)[]
  height?: string | number | (string | number)[]
}

const BlurryImage: React.FC<BlurryImageProps> = ({
  src,
  alt,
  overlayOpacity = 0.5,
  width = '100%',
  height = 'auto',
}) => {
  return (
    <Box position="relative" width={width} height={height}>
      <Image src={src} alt={alt} width="100%" height="100%" objectFit="cover" />

      <Box position="absolute" top={0} left={0} width="100%" height="100%" bg="white" opacity={overlayOpacity} />
    </Box>
  )
}

export default BlurryImage
