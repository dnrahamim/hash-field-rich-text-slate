import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import styled from 'react-emotion'
import Select from 'react-select'

import initialValue from './value.json'
import { isKeyHotkey } from 'is-hotkey'
import { Button, Icon, Toolbar } from '../components'

/**
 * Define the default node type.
 *
 * @type {String}
 */

 const DEFAULT_NODE = 'paragraph'

 const Emoji = styled('span')`
 outline: ${props => (props.selected ? '2px solid blue' : 'none')};
`

/**
 * Emojis.
 *
 * @type {Array}
 */

const EMOJIS = [
  '😃',
  '😬',
  '😂',
  '😅',
  '😆',
  '😍',
  '😱',
  '👋',
  '👏',
  '👍',
  '🙌',
  '👌',
  '🙏',
  '👻',
  '🍔',
  '🍑',
  '🔑',
]

/**
 * No ops.
 *
 * @type {Function}
 */

const noop = e => e.preventDefault()
 
/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')
const isFieldHotkey = isKeyHotkey('mod+3')

/**
 * A styled Field inline component.
 *
 * @type {Component}
 */

class Field extends React.Component {

  state = {
    selection: 'empty'
  }

  constructor() {
    super()
    // create a ref to store the select DOM element
    this.selectRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selectedOption) {
    if(selectedOption !== 'empty') {
      this.setState({'selection': selectedOption});
    }
  }

  componentDidMount() {
    //debugger;
    //this.mySelect.openMenu();
  }

  render() {
    let myElement
    if(this.state.selection === 'empty') {
      const options = [
        { value: 'empty', label: '-- select a field --' },
        { value: 'field1', label: 'field1' },
        { value: 'field2', label: 'field2' },
        { value: 'field3', label: 'field3' },
        { value: 'field4', label: 'field4' },
      ]
      this.mySelect = <Select style={{'width': '200px'}} defaultMenuIsOpen={true} options={options} />
      myElement = 
        <span {...this.props.attributes} style={{ display: 'inline-block', width: '200px', maxWidth: '200px'}}>
            {this.mySelect}
        </span>
    } else {
      const divStyle = {
        color: 'red',
      };
      myElement = <b style={divStyle}>#{this.state.selection}</b>
    }
    return (
      myElement
    );
  }
}


/**
 * The rich text example.
 *
 * @type {Component}
 */

class RichTextExample extends React.Component {
  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
  }

  /**
   * The editor's schema.
   *
   * @type {Object}
   */

  schema = {
    inlines: {
      emoji: {
        isVoid: true,
      },
      field: {
        isVoid: true,
      },
    },
  }

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = type => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type == type)
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = type => {
    const { value } = this.state
    return value.blocks.some(node => node.type == type)
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <div>
        <Toolbar>
          {this.renderMarkButton('bold', 'format_bold')}
          {this.renderMarkButton('italic', 'format_italic')}
          {this.renderMarkButton('underlined', 'format_underlined')}
          {this.renderMarkButton('code', 'code')}
          {this.renderBlockButton('heading-one', 'looks_one')}
          {this.renderBlockButton('heading-two', 'looks_two')}
          {this.renderBlockButton('block-quote', 'format_quote')}
          {this.renderBlockButton('numbered-list', 'format_list_numbered')}
          {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
          <Button onMouseDown={e => this.onClickEmoji(e, EMOJIS[0])}>
            <Icon>{EMOJIS[0]}</Icon>
          </Button>
        </Toolbar>
        <Editor
          spellCheck
          autoFocus
          placeholder="Enter some rich text..."
          schema={this.schema}
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
        />
      </div>
    )
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }

  /**
   * Render a block-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type)

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { value } = this.state
      const parent = value.document.getParent(value.blocks.first().key)
      isActive = this.hasBlock('list-item') && parent && parent.type === type
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = props => {
    const { attributes, children, node, isFocused } = props

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      case 'field': {
        return (
          <Field {...props}/>
        )
      }
      case 'emoji': {
        const code = node.data.get('code')
        return (
          <Emoji
            {...props.attributes}
            selected={isFocused}
            contentEditable={false}
            onDrop={noop}
          >
            {code}
          </Emoji>
        )
      }
    }
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = props => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
    }
  }

  /**
   * On change, save the new `value`.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Change} change
   * @return {Change}
   */

  onKeyDown = (event, change) => {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      if (isFieldHotkey(event)) {
        this.onInsertField(event, change)
      }
      return
    }

    event.preventDefault()
    change.toggleMark(mark)
    return true
  }

  /**
   * Insert a new field when you hit the hotkey
   * (or possibly when you insert the button)
   *
   * @param {Event} e
   */

  onInsertField = (e, change) => {
    e.preventDefault()

    change
      .insertInline({
        type: 'field'
      })
      .moveToStartOfNextText()
      .focus()

    this.onChange(change)
  }

  /**
   * When clicking a emoji, insert it
   *
   * @param {Event} e
   */

  onClickEmoji = (e, code) => {
    e.preventDefault()
    const { value } = this.state
    const change = value.change()

    change
      .insertInline({
        type: 'emoji',
        data: { code },
      })
      .moveToStartOfNextText()
      .focus()

    this.onChange(change)
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change().toggleMark(type)
    this.onChange(change)
  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change()
    const { document } = value

    // Handle everything but list buttons.
    if (type != 'bulleted-list' && type != 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        change
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        change.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type == type)
      })

      if (isList && isType) {
        change
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        change
          .unwrapBlock(
            type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type)
      } else {
        change.setBlocks('list-item').wrapBlock(type)
      }
    }

    this.onChange(change)
  }
}

/**
 * Export.
 */

export default RichTextExample
