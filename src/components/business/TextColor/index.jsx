import './style.scss'
import React from 'react'
import { Modifier, EditorState, RichUtils } from 'draft-js'
import { colors } from 'configs/maps'
import { UniqueIndex } from 'utils/base'
import DropDown from 'components/common/DropDown'
import ColorPicker from 'components/common/ColorPicker'

export default class TextColor extends React.Component {

  state = {
    colorType: 'color'
  }

  dropDown = {}
  dropDownId = 'BRAFT-DROPDOWN-' + UniqueIndex()

  render () {

    let captionStyle = {}
    let currentIndex = null
    let { colorType } = this.state
    let { currentInlineStyle, onChange } = this.props

    colors.forEach((item, index) => {

      if (currentInlineStyle.has('COLOR-' + index)) {
        captionStyle.color = item
        colorType === 'color' && (currentIndex = index)
      }

      if (currentInlineStyle.has('BGCOLOR-' + index)) {
        captionStyle.backgroundColor = item
        colorType === 'backgroundColor' && (currentIndex = index)
      }

    })

    let caption = (
      <i
        style={captionStyle}
        className="icon-text-color"
      >
        <span className="path1"></span>
        <span className="path2"></span>
      </i>
    )

    return (
      <DropDown
        caption={caption}
        hoverTitle="颜色"
        showDropDownArrow={false}
        componentId={this.dropDownId}
        ref={(instance) => this.dropDown = instance}
        className={"control-item dropdown text-color-dropdown"}
      >
        <div className="text-color-picker-wrap">
          <div className="switch-buttons">
            <button
              data-type="color"
              data-keep-active={true}
              data-braft-component-id={this.dropDownId}
              className={colorType === 'color' ? 'active' : ''}
              onClick={this.switchColorType}
            >文字颜色</button>
            <button
              data-type="backgroundColor"
              data-keep-active={true}
              data-braft-component-id={this.dropDownId}
              className={colorType === 'backgroundColor' ? 'active' : ''}
              onClick={this.switchColorType}
            >背景颜色</button>
          </div>
          <ColorPicker
            width={200}
            current={currentIndex}
            disableAlpha={true}
            colors={colors}
            onChange={this.toggleColor}
          />
        </div>
      </DropDown>
    )

  }

  switchColorType = (e) => {
    this.setState({
      colorType: e.target.dataset.type
    })
  }

  toggleColor = (index) => {

    const prefix = this.state.colorType === 'color' ? 'COLOR-' : 'BGCOLOR-'
    const toggledColor = prefix + index
    const { editorState, selection, currentInlineStyle } = this.props
    const nextContentState = colors.reduce((contentState, item, index) => {
      return Modifier.removeInlineStyle(contentState, selection, prefix + index) 
    }, editorState.getCurrentContent())

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    )

    if (selection.isCollapsed()) {
      nextEditorState = currentInlineStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color)
      }, nextEditorState)
    }

    if (!currentInlineStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor
      );
    }

    this.props.onChange(nextEditorState)
    this.dropDown.hide()

  }

}