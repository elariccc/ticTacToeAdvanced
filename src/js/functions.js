export function deepCloneArray(arr) 
{
  return arr.map(item => Array.isArray(item) ? deepCloneArray(item) : item);
}

export function setNewStates(...newStates) {
  this.setState(Object.assign({}, ...newStates));
}