const FORMINPUTS = document.getElementById('inputs');
let inputRows = [];
function updateForm() {
  let numTeams = document.getElementById('numTeams').value;
  if (inputRows.length < numTeams && numTeams != 0) {
    for (let i=inputRows.length; i < numTeams; i++) {
      inputRows[inputRows.length] = createRow(inputRows.length); 
      FORMINPUTS.appendChild(inputRows[inputRows.length - 1]);
    }
  } else if (inputRows.length > numTeams) {
    for(let i=inputRows.length; i > numTeams; i--) {
    FORMINPUTS.removeChild(inputRows[inputRows.length -1]);
    inputRows.pop();
    }
  }
}


/**
 * @param  {Number} id
 * @returns {HTMLElement}
 */
function createNameBox(id) {
  let col = document.createElement('div');
  col.className = 'col';
  let input = document.createElement('input');
  input.type = 'text';
  input.classList.add('form-control');
  input.classList.add('nameInputs');
  input.placeholder = `Team ${id + 1}'s Name`;
  input.name = `name${id}`;
  col.appendChild(input);
  return col;
}
/**
 * @param  {Number} id
 * @returns {HTMLElement}
 */
function createBudgetBox(id) {
  let col = document.createElement('div');
  col.className = 'col';
  let inputGroup = document.createElement('div');
  inputGroup.classList.add('input-group');
  inputGroup.classList.add('mb-3');
  let inputPrepend = document.createElement('div');
  inputPrepend.className = 'input-group-prepend';
  let inputText = document.createElement('span');
  inputText.className = 'input-group-text';
  inputText.innerHTML = '$'
  inputPrepend.appendChild(inputText);
  inputGroup.appendChild(inputPrepend);
  
  let input = document.createElement('input');
  input.type = 'number';
  input.className = 'form-control';
  input.placeholder = `Team ${id + 1}'s Allocation`;
  input.name = `budget${id}`;
  inputGroup.appendChild(input);
  
  let inputAppend = document.createElement('div');
  inputAppend.className = 'input-group-append';
  let appendText = document.createElement('span');
  appendText.innerHTML = '.00';
  inputAppend.appendChild(appendText);
  inputGroup.appendChild(inputAppend);
  
  col.appendChild(inputGroup);
  return col;
}
/**
 * @param  {Number} id
 * @returns {HTMLElement}
 */

function createRow(id) {
  let row = document.createElement('div');
  row.className = 'form-row';
  let name = createNameBox(id);
  let budget = createBudgetBox(id);
  row.appendChild(name);
  row.appendChild(budget);
  return row
}


