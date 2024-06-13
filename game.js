//класс - таблица
class Table
{
	constructor(rows = 15, columns = 1, isActive = true, borderWidth = '5px', text = 'none', isWritable = false, topIn = false, topOut = false, rightIn = false, rightOut = false, bottomIn = false, bottomOut = false, leftIn = false, leftOut = false, textTop = true)
	{
		this.rows = rows;
		this.columns = columns;
		this.isActive = isActive;
		this.borderWidth = borderWidth;
		this.text = text;
		this.isWritable = isWritable;
		this.topIn = topIn;
		this.topOut = topOut;
		this.rightIn = rightIn;
		this.rightOut = rightOut;
		this.bottomIn = bottomIn;
		this.bottomOut = bottomOut;
		this.leftIn = leftIn;
		this.leftOut = leftOut;
		this.textTop = textTop;
		this.tableElement = this.createTable();
	}

	createTable()
	{
		const container = document.createElement('div');
		container.classList.add('table-container');
		const table = document.createElement('table');
		table.style.borderWidth = this.borderWidth;
		
		for (let i = 0; i < this.rows; i++)
		{
			const row = table.insertRow();
			for (let j = 0; j < this.columns; j++)
			{
				const cell = row.insertCell();
				if (this.isActive && this.isWritable)
				{
					const input = document.createElement('input');
					input.type = 'text';
					cell.appendChild(input);
					input.addEventListener('keydown', (event) => {this.handleMoveKeys(event, table, i, j);});
					input.addEventListener('focus', (event) => {this.updatePointer(table, i);});
				}
				cell.style.borderWidth = this.borderWidth;
			}
		}

		if (this.isActive)
			table.classList.add('active');
		else
			table.classList.add('inactive');

		container.appendChild(table);
		
		if (this.text != 'none')
		{
			const text = document.createElement('div');
			if(this.textTop)
				text.classList.add('text-top');
			else
				text.classList.add('text-bottom');
			text.innerHTML = this.text;
			container.appendChild(text);
		}

		if (this.bottomIn)
		{
			const arrowDownIn = document.createElement('div');
			arrowDownIn.classList.add('arrow', 'arrow-down-in');
			arrowDownIn.innerHTML = '&#8681;';
			container.appendChild(arrowDownIn);
		}

		if (this.topIn)
		{
			const arrowUpIn = document.createElement('div');
			arrowUpIn.classList.add('arrow', 'arrow-up-in');
			arrowUpIn.innerHTML = '&#8681;';
			container.appendChild(arrowUpIn);
		}

		if (this.leftIn)
		{
			const arrowLeftIn = document.createElement('div');
			arrowLeftIn.classList.add('arrow', 'arrow-left-in');
			arrowLeftIn.innerHTML = '&#8681;';
			container.appendChild(arrowLeftIn);
		}

		if (this.rightIn)
		{
			const arrowRightIn = document.createElement('div');
			arrowRightIn.classList.add('arrow', 'arrow-right-in');
			arrowRightIn.innerHTML = '&#8681;';
			container.appendChild(arrowRightIn);
		}

		if (this.bottomOut)
		{
			const arrowDownOut = document.createElement('div');
			arrowDownOut.classList.add('arrow', 'arrow-down-out');
			arrowDownOut.innerHTML = '&#8681;';
			container.appendChild(arrowDownOut);
		}

		if (this.topOut)
		{
			const arrowUpOut = document.createElement('div');
			arrowUpOut.classList.add('arrow', 'arrow-up-out');
			arrowUpOut.innerHTML = '&#8681;';
			container.appendChild(arrowUpOut);
		}

		if (this.leftOut)
		{
			const arrowLeftOut = document.createElement('div');
			arrowLeftOut.classList.add('arrow', 'arrow-left-out');
			arrowLeftOut.innerHTML = '&#8681;';
			container.appendChild(arrowLeftOut);
		}

		if (this.rightOut)
		{
			const arrowRightOut = document.createElement('div');
			arrowRightOut.classList.add('arrow', 'arrow-right-out');
			arrowRightOut.innerHTML = '&#8681;';
			container.appendChild(arrowRightOut);
		}

		return container;
	}

	render(container)
	{
		if (container && container instanceof HTMLElement)
			container.appendChild(this.tableElement);
		else
			console.error('Invalid container element');
	}

	setCellText(row, col, text)
	{
		const table = this.tableElement.querySelector('table');
		if (row < this.rows && col < this.columns)
		{
			const cell = table.rows[row].cells[col];
			if (cell)
				cell.textContent = text;
			else
				console.error('Invalid cell');
		}
		else
			console.error('Invalid row or column index');
	}
	
	//перемещение по таблице стрелочками / с помощью Enter
	handleMoveKeys(event, table, row, col)
	{
		let totalRows = table.rows.length;
		let totalCols = table.rows[0].cells.length;
		let nextInput;

		switch (event.key)
		{
			case 'ArrowUp':
				if (row > 0)
					nextInput = table.rows[row - 1].cells[col].querySelector('input');
				break;
			case 'ArrowDown':
				if (row < totalRows - 1)
					nextInput = table.rows[row + 1].cells[col].querySelector('input');
				break;
			case 'ArrowLeft':
				if (col > 0)
					nextInput = table.rows[row].cells[col - 1].querySelector('input');
				break;
			case 'ArrowRight':
				if (col < totalCols - 1)
					nextInput = table.rows[row].cells[col + 1].querySelector('input');
				break;
			case 'Enter':
				if (row < totalRows - 1)
					nextInput = table.rows[row + 1].cells[col].querySelector('input');
				break;
		}

		if (nextInput)
		{
			this.updatePointer(table, row, nextInput.parentElement.parentElement.rowIndex);
			nextInput.focus();
			event.preventDefault();
		}
	}
	
	//обновление указателя
	updatePointer(table, currentRowIndex)
	{
		//удаление указателей на всей странице
		document.querySelectorAll('.input-arrow').forEach(arrow => arrow.remove());
		
		//добавление указателя на текущей строке
		let currentRow = table.rows[currentRowIndex];
		let currentArrowCell = currentRow.cells[0];
		let arrow = document.createElement('span');
		arrow.classList.add('input-arrow');
		arrow.textContent = '>';
		currentArrowCell.prepend(arrow);
	}
}

// функция для установки текста в таблицу
function setTableText(array, tableIndex, rowIndex, text, separator = '|', columnIndex = 0, between = '')
{
	let texts = text.split(separator);
	if (tableIndex >= 0 && tableIndex < array.length)
	{
		let c = 0;
		for(let i=rowIndex;i<rowIndex+texts.length;i++)
		{
			array[tableIndex].setCellText(i, columnIndex, between + texts[c]);
			c++;
		}
	}
	else
		console.error('Invalid table index');
}

//post запрос
function postHTTP(level, rightTables, vars, leftTables)
{
	//удаление указателей на всей странице
	document.querySelectorAll('.input-arrow').forEach(arrow => arrow.remove());
	let jsonPost = new Object();
	jsonPost.nodes = new Array;
	
	//правые таблицы с кодом
	for (let i = 0; i < rightTables.length; i++)
	{
		jsonPost.nodes[i] = new Object();
		jsonPost.nodes[i].index = i;
		jsonPost.nodes[i].code = new Array;
		let a = 0;
		for (let j = 0; j < rightTables[i].rows; j++)
			if (rightTables[i].isActive)
				if (rightTables[i].tableElement.children[0].children[0].children[j].children[0].children[0].value != '')
				{
					jsonPost.nodes[i].code[a] = rightTables[i].tableElement.children[0].children[0].children[j].children[0].children[0].value;
					a++;
				}
	}
	
	//input
	jsonPost.in = new Array;
	for (let i = 0; i < vars.inputCount; i++)
	{
		jsonPost.in[i] = new Object();
		jsonPost.in[i].index = +vars.input[i][0];
		jsonPost.in[i].values = vars.input[i][2];
	}
	
	//expected
	jsonPost.expected = new Array;
	for (let i = 0; i < vars.expectedCount; i++)
	{
		jsonPost.expected[i] = new Object();
		jsonPost.expected[i].index = +vars.expected[i][0];
		jsonPost.expected[i].values = vars.expected[i][2];
	}
	
	//post запрос
	jsonPost = JSON.stringify(jsonPost);
	let Http = new XMLHttpRequest();
	Http.open("POST", api + '/' + level, false);
	Http.setRequestHeader("Content-Type", "application/json");
	Http.send(jsonPost);
	jsonPost = JSON.parse(Http.responseText);
	
	if (JSON.stringify(jsonPost.code_validation) == 'false')
		alert ('Программа не запустилась');
	else
	{
		//вывод результата
		let a = 0;
		
		for (let i = leftTables.length - vars.expected.length; i < leftTables.length; i++)
		{
			let temp = JSON.stringify(jsonPost.out[a].values);
			temp = temp.substring(1, temp.length - 1);
			if (temp.length != 0)
				setTableText(leftTables, i, 0, temp, ',', 1, '—  ');
			a++;
		}
		
		if (JSON.stringify(jsonPost.check_status) == 'false')
			alert ('Неверное решение');
		else
			alert ('Верное решение');
	}
}

//вывод списка уровней
function printLevels(json)
{
	for (let i = 0; i < JSON.stringify(json.levels.length); i++)
	{
		let temp = JSON.stringify(json.levels[i]);
		temp = temp.substring(1, temp.length - 1);
		levels[i] = temp;
		printToConsole(temp);
	}
}

//HTTP запрос
function getHTTP(level)
{
	let Http = new XMLHttpRequest();
	Http.open("GET", api + '/' + level, false);
	Http.send();
	let json;
	json = JSON.parse(Http.responseText);
	return json;
}

//переменные
function createVariables(json)
{
	let vars = new Object();
	
	//ввод
	vars.inputCount = JSON.stringify(json.in.length);
	vars.input = new Array;
	for(let i = 0; i < vars.inputCount; i++)
	{
		vars.input[i] = new Array;
		vars.input[i][0] = JSON.stringify(json.in[i].index);
		vars.input[i][1] = JSON.stringify(json.in[i].name);
		vars.input[i][1] = vars.input[i][1].substring(1, vars.input[i][1].length - 1);
		let temp = JSON.stringify(json.in[i].values);
		temp = temp.substring(1, temp.length - 1);
		vars.input[i][2] = temp.split(',').map(Number);
		
		//список ввода
		vars.inputIndexes = new Array;
		for (let i = 0; i < vars.input.length; i++)
			vars.inputIndexes[i] = Number(vars.input[i][0]);
		
		//вывод
		vars.expectedCount = JSON.stringify(json.expected.length);
		vars.expected = new Array;
		for(let i = 0; i < vars.expectedCount; i++)
		{
			vars.expected[i] = new Array;
			vars.expected[i][0] = JSON.stringify(json.expected[i].index);
			vars.expected[i][1] = JSON.stringify(json.expected[i].name);
			vars.expected[i][1] = vars.expected[i][1].substring(1, vars.expected[i][1].length - 1);
			let temp = JSON.stringify(json.expected[i].values);
			temp = temp.substring(1, temp.length - 1);
			vars.expected[i][2] = temp.split(',').map(Number);
		}
		
		//список вывода
		vars.outputIndexes = new Array;
		for (let i = 0; i < vars.expected.length; i++)
			vars.outputIndexes[i] = Number(vars.expected[i][0]);
	}
	
	//layout: 0 - работает; 1 - не работает
	vars.layoutCount = JSON.stringify(json.layout.length);
	vars.layout = new Array;
	for(let i = 0; i < vars.layoutCount; i++)
		vars.layout[i] = JSON.stringify(json.layout[i].type);
	
	//название
	vars.title = JSON.stringify(json.title);
	vars.title = vars.title.substring(1, vars.title.length - 1);
	
	//описание
	vars.description = JSON.stringify(json.description);
	vars.description = vars.description.substring(1, vars.description.length - 1);
	
	return vars;
}

//право
function makeRightContainer(vars)
{
	var rightTables = new Array;
	const rightContainer = document.getElementById('right-container');
	for (let i = 0; i < vars.layoutCount; i++)
	{
		if (vars.layout[i] == 0)
		{
			let arrows = new Array(true,true,true,true);
			//верх
			if (i < 4)
				arrows[0] = false;
			//лево
			if (i % 4 == 0)
				arrows[3] = false;
			//право
			if (i == 3 || i == 7 || i == 11)
				arrows[1] = false;
			//низ
			if (i > 7)
				arrows[2] = false;
			
			let inputNum = vars.inputIndexes.indexOf(i);
			let outputNum = vars.outputIndexes.indexOf(i);
			if (inputNum != -1)
				rightTables[i] = new Table(15, 1, true, '5px', vars.input[inputNum][1], true, true, arrows[0], false, arrows[1], false, arrows[2], false, arrows[3]);
			else if (outputNum != -1)
				rightTables[i] = new Table(15, 1, true, '5px', vars.expected[outputNum][1], true, false, arrows[0], false, arrows[1], false, true, false, arrows[3], false);
			else
			rightTables[i] = new Table(15, 1, true, '5px', 'none', true, false, arrows[0], false, arrows[1], false, arrows[2], false, arrows[3]);
			rightTables[i].render(rightContainer);
		}
		else
		{
			rightTables[i] = new Table(15, 1, false, '5px');
			rightTables[i].render(rightContainer);
		}
	}
	return rightTables;
}

//лево
function makeLeftContainer(vars)
{
	const leftTopContainer = document.getElementById('top-table-container');
	const centerTableContainer = document.getElementById('center-table-container');
	
	//название
	var leftTables = new Array;
	leftTables[0] = new Table(10, 1, true, '5px', vars.title);
	leftTables[0].render(leftTopContainer);
	
	//описание
	setTableText(leftTables, 0, 0, vars.description)
	
	let temp = leftTables.length;
	
	let a = 0;
	
	//создание ввода
	for (let i = temp; i < (+vars.inputCount + temp); i++)
	{
		leftTables[i] = new Table(vars.input[a][2].length, 1, true, '5px', vars.input[a][1]);
		leftTables[i].render(centerTableContainer);
		a++;
	}
	
	temp = leftTables.length;
	a = 0;
	
	//создание вывода
	for (let i = temp; i < (+vars.expectedCount + temp); i++)
	{
		leftTables[i] = new Table(vars.expected[a][2].length, 2, true, '5px', vars.expected[a][1]);
		a++;
		leftTables[i].render(centerTableContainer);
	}
	
	//заполнение ввода
	a = 0;
	for (let i = 1; i < vars.input.length + 1; i++)
	{
		setTableText(leftTables, i, 0, vars.input[a][2].toString(), ',');
		a++;
	}
	
	//заполнение вывода
	a = 0;
	for (let i = 1 + vars.input.length; i < leftTables.length; i++)
	{
		setTableText(leftTables, i, 0, vars.expected[a][2].toString(), ',');
		a++;
	}
	return leftTables;
}

//main функция
function game()
{
	let params = new URLSearchParams(window.location.search);
	let level = params.get("level");
	let json = getHTTP(level);
	
	let vars = createVariables(json);
	let rightTables = makeRightContainer(vars);
	let leftTables = makeLeftContainer(vars);
	
	let runButton = document.getElementById('Run');
	runButton.addEventListener('click', () => postHTTP(level, rightTables, vars, leftTables));
}
