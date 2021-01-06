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

    this.setNewGameState = this.setNewGameState.bind(this);
    this.handleToggleGravity = this.handleToggleGravity.bind(this);
    this.setNewStates = setNewStates.bind(this);
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
      <form onSubmit = { this.setNewGameState }>
        <InputNumber
          min = '2'
          max = '50'
          defaultValue = '3'
          onChange = { this.setNewStates }
          stateKey = 'height'
        >Height of the field</InputNumber>
        <InputNumber
          min = '2'
          max = '50'
          defaultValue = '3'
          onChange = { this.setNewStates }
          stateKey = 'width'
        >Width of the field</InputNumber>
        <InputNumber
          min = '2'
          max = { Math.min(this.state.height, this.state.width) }
          defaultValue = '3'
          onChange = { this.setNewStates }
          stateKey = 'winLength'
        >Length of line to win</InputNumber>
        <InputCheckBox
          id = 'gravity'
          checked = { this.state.gravity }
          onChange = { this.handleToggleGravity }
        >Turn on "gravity"?</InputCheckBox>
        <input type = 'submit' value = 'Confirm' />
      </form>
    );
  }
}