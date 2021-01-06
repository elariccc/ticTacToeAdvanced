export function InputCheckBox ({id, checked, onChange, children}) {
  return (
    <div className='checkbox'>
      <input 
        type = 'checkbox' 
        id = {id} 
        checked = {checked}
        onChange = {onChange}
      >
      </input>
      <label htmlFor = {id}>{children}</label>
    </div>
  );
}

export function InputNumber ({children, min, max, defaultValue, onChange, stateKey}) {
  function handleChange(event) {
    onChange({[stateKey]: +event.target.value});
  }

  return (
    <p>{children}: <input
      type = 'number'
      min = {min}
      max = {max}
      defaultValue = {defaultValue}
      onChange = {handleChange}
    /></p>
  );
}