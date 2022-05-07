import styled from 'styled-components'
import ImagePreview from '../ImagePreview'
import AnimatedPreview from '../AnimatedPreview'

const RowContainer = styled.div`
  height: 192px;
`

export function Row (props) {
  const { row, animated, rowLen } = props

  return (
    <RowContainer className="flex">
      {row.map((item, i) => animated
        ? <AnimatedPreview
          key={i + item.url}
          item={item}
        />
        : <ImagePreview
          key={i + item.url}
          item={item}
        />)}

      {rowLen && new Array(rowLen - row.length).fill(0).map(() => <div className="w-full"></div>)}
    </RowContainer>
  )
}
