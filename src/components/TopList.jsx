import React, { Component } from "react"

import { ReactWindowScroller } from 'react-window-scroller'
import { FixedSizeList as List } from 'react-window'

class TopList extends Component {
  render() {
    return (
      <ReactWindowScroller>
        {({ ref, outerRef, style, onScroll }) => {
          return (
            <List
              ref={ref}
              outerRef={outerRef}
              style={style}
              onScroll={onScroll}

              className="List"
              height={typeof width !== 'undefined' ? window.innerHeight : 500}
              itemCount={this.props.rowsCount}
              itemSize={192}
              itemData={this.props.data}
            >
              {this.props.row}
            </List>
          )
        }}
      </ReactWindowScroller>
    )
  }
}

export default TopList
