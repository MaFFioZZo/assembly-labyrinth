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
}

// функция для установки текста в таблицу
function setTableText(array, tableIndex, rowIndex, text, separator = '|', columnIndex = 0)
{
	let texts = text.split(separator);
	if (tableIndex >= 0 && tableIndex < array.length)
	{
		let c = 0;
		for(let i=rowIndex;i<rowIndex+texts.length;i++)
		{
			array[tableIndex].setCellText(i, columnIndex, texts[c]);
			c=c+1;
		}
	}
	else
		console.error('Invalid table index');
}

//post запрос
function postHTTP(level, rightTables, input, expected, leftTables)
{
	let jsonPost = new Object();
	jsonPost.nodes = new Array;
	
	//правые таблицы с кодом
	for (let i = 0; i < rightTables.length; i++)
	{
		jsonPost.nodes[i] = new Object();
		jsonPost.nodes[i].index = i;
		jsonPost.nodes[i].code = new Array;
		for (let j = 0; j < rightTables[i].rows; j++)
			if (rightTables[i].isActive)
				if (rightTables[i].tableElement.children[0].children[0].children[j].children[0].children[0].value != '')
					jsonPost.nodes[i].code[j] = rightTables[i].tableElement.children[0].children[0].children[j].children[0].children[0].value;
	}
	
	//input
	jsonPost.in = new Array;
	for (let i = 0; i < input.length; i++)
	{
		jsonPost.in[i] = new Object();
		jsonPost.in[i].index = +input[i][0];
		jsonPost.in[i].values = input[i][2];
	}
	
	//expected
	jsonPost.expected = new Array;
	for (let i = 0; i < expected.length; i++)
	{
		jsonPost.expected[i] = new Object();
		jsonPost.expected[i].index = +expected[i][0];
		jsonPost.expected[i].values = expected[i][2];
	}
	
	//post запрос
	jsonPost = JSON.stringify(jsonPost);
	let Http = new XMLHttpRequest();
	Http.open("POST", api + '/' + level, false);
	Http.setRequestHeader("Content-Type", "application/json");
	Http.send(jsonPost);
	jsonPost = JSON.parse(Http.responseText);
	
	console.log(jsonPost);
	
	if (JSON.stringify(jsonPost.code_validation) == 'false')
		alert ('Программа не запустилась');
	else
	{
		//вывод результата
		let a = 0;
		
		for (let i = leftTables.length - expected.length; i < leftTables.length; i++)
		{
			let temp = JSON.stringify(jsonPost.out[a].values);
			temp = temp.substring(1, temp.length - 1);
			setTableText(leftTables, i, 0, temp, ',', 1);
			a=a+1;
		}
		
		if (JSON.stringify(jsonPost.check_status) == 'false')
			alert ('Неверное решение');
		else
			alert ('Верное решение');
	}
}
