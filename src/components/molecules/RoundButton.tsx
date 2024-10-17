import React from 'react'
import Button from '@/components/atoms/Button'
import { ResponsiveValue } from '@chakra-ui/react'

interface DefaultButtonProps {
  label: string
  onClick: () => void
  color: string
  size?: ResponsiveValue<string>
  fontSize?: ResponsiveValue<string> // fontSize를 추가
  px?: number | string | (number | string)[] // 커스텀 padding-x
  py?: number | string | (number | string)[] // 커스텀 padding-y
  fontWeight?: string
}

const RoundButton: React.FC<DefaultButtonProps> = ({
  label,
  onClick,
  color,
  size = 'lg',
  fontSize = 'md',
  px,
  py,
  fontWeight = 'normal',
}) => {
  return (
    <div>
      <Button
        onClick={onClick}
        color="white"
        bg={color}
        _hover={{ bg: 'brand.primary2' }}
        isDisabled={false}
        borderRadius="full"
        size={size}
        fontSize={fontSize} // fontSize를 Button에 전달
        px={px}
        py={py}
        fontWeight={fontWeight}
      >
        {label}
      </Button>
    </div>
  )
}

export default RoundButton
