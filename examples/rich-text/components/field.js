import React from 'react'
import Select from 'react-select'

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

    /**
     * Insert a new field when you hit the hotkey
     * (or possibly when you insert the button)
     *
     * @param {Event} e
     */

    static onInsertField = (e, change) => {
        e.preventDefault()

        change
        .insertInline({
            type: 'field'
        })
        .moveToStartOfNextText()
        .focus()

        this.onChange(change)
    }
  
    handleChange(selectedOption) {
      if(selectedOption !== 'empty') {
        this.setState({'selection': selectedOption});
      }
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

export default Field