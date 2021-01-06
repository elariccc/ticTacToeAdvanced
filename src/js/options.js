import React from 'react';
import {InputCheckBox, InputNumber} from './formInputs.js';
import {setNewStates} from './functions.js';

export default class Options extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{
        location: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      ascendingOrder: true,
      hide: false,
      height: 3,
      width: 3,
      winLength: 3,
      gravity: false,
    };
  }

  setNewGameState(event) {
    event.preventDefault();
    
    this.props.onSubmit(
      this.state, 
      {
        history: [{
          squares: Array(this.state.height).fill(Array(this.state.width).fill(null)),
        }]
      }
    );
  }

  handleToggleGravity(event) {
    this.setState({gravity: event.target.checked});
  }

  render() {
    return(
      <form onSubmit = { this.setNewGameState.bind(this) }>
        <InputNumber
          min = '2'
          max = '50'
          defaultValue = '3'
          onChange = { setNewStates.bind(this) }
          stateKey = 'height'
        >Height of the field</InputNumber>
        <InputNumber
          min = '2'
          max = '50'
          defaultValue = '3'
          onChange = { setNewStates.bind(this) }
          stateKey = 'width'
        >Width of the field</InputNumber>
        <InputNumber
          min = '2'
          max = { Math.min(this.state.height, this.state.width) }
          defaultValue = '3'
          onChange = { setNewStates.bind(this) }
          stateKey = 'winLength'
        >Length of line to win</InputNumber>
        <InputCheckBox
          id = 'gravity'
          checked = { this.state.gravity }
          onChange = { this.handleToggleGravity.bind(this) }
        >Turn on "gravity"?</InputCheckBox>
        <input type = 'submit' value = 'Confirm' />
      </form>
    );
  }
}