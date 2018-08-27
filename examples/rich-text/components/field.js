import React from 'react'
import Select from 'react-select'

/**
 * A styled Field inline component.
 *
 * @type {Component}
 */

class Field extends React.Component {

    state = {
      value: 'empty',
      isMenu: 'true'
    }
  
    constructor(props) {
      super(props)
      this.handleChange = this.handleChange.bind(this)
      this.handleClosedClick = this.handleClosedClick.bind(this)
    }

    /**
     * Insert a new field when you hit the hotkey
     * (or possibly when you insert the button)
     *
     * @param {Event} e
     */
    handleChange(selectedOption) {
        const change = this.props.editor.value.change();
        if(selectedOption.value !== 'empty') {
            this.setState({
                'isMenu': false,
                'value': selectedOption.value
            });
            change
                .moveToStartOfNextBlock()
                .focus()
        }
    } 

    handleClosedClick(event) {
        this.setState({
            'isMenu': true
        });
    }
  
    render() {
      if(this.state.isMenu) {
        const options = [
          { value: 'empty', label: '-- select a field --' },
          { value: 'field1', label: 'field1' },
          { value: 'field2', label: 'field2' },
          { value: 'field3', label: 'field3' },
          { value: 'field4', label: 'field4' },
        ]
        return (
          <span {...this.props.attributes} style={{ display: 'inline-block', width: '200px', maxWidth: '200px'}}>
            <Select 
              defaultMenuIsOpen={true}
              options={options}
              onChange={this.handleChange}
              isSearchable={true}
            />
          </span>
        );
      } else {
        const divStyle = {
          color: 'red',
        };
        return (
            <b 
                style={divStyle}
                onClick={this.handleClosedClick}
            >#{this.state.value}</b>
        )
      }
    }
  }

export default Field