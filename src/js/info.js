import { InputCheckBox } from './formInputs.js';
import '../css/info.css';

export default function Info({status, ascendingOrder, onCheckBoxChange, moves}) {
  return (
    <div className = "info">
      <div>{status}</div>
      <InputCheckBox
        id = 'order'
        checked = { ascendingOrder } 
        onChange = { onCheckBoxChange }
      >Moves in ascending order?</InputCheckBox>
      <ol 
        className = 'info__list'
        reversed = { !ascendingOrder }
      >{moves}</ol>
    </div>
  );
}
