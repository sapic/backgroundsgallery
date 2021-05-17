import styled from 'styled-components'
import ImagePreview from '@/components/ImagePreview'

const RowContainer = styled.div`
  height: 192px;
`

export function Row(props) {
  const { row } = props

  return (
    <RowContainer className="flex">
      {row.map((item, i) => <ImagePreview
        key={i + item.url}
        item={item}
      />)}
    </RowContainer>
  )
}
