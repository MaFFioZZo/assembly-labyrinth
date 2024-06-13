//список команд
const commands = ['help', 'clear', 'version', 'levels', 'start'];

//список уровней
let levels = new Array();

let commandHistory = new Array();
let historyIndex = -1;

var consoleDiv;
var outputDiv;
var inputContainer;
var inputField;

//вывод в консоль
function printToConsole(text)
{
	let line = document.createElement('div');
	line.textContent = text;
	outputDiv.appendChild(line);
	consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

//команды
function executeCommand(command)
{
	switch (command)
	{
		case ('help'):
			printToConsole('Available commands:');
			printToConsole('clear - clear the output');
			printToConsole('help - see this message');
			printToConsole('levels - show available levels');
			printToConsole('start - start level');
			printToConsole('version - show version');
			break;
		case ('clear'):
			outputDiv.innerHTML = '';
			break;
		case ('version'):
			printToConsole('Assembly Labyrinth by FranChesKo and MaFFioZZo');
			printToConsole('Version 1.0.1');
			break;
		case ('start'):
			printToConsole('Use: start <level>');
			printToConsole('Hint: type "levels" to see list of available levels');
			break;
		case ('levels'):
			let json = getHTTP(api);
			getLevels(json);
			printToConsole('List of levels:');
			printLevels(levels);
			break;
		case (''):
			printToConsole(' ');
			break;
		default:
			let check = command.startsWith('start') ? true : false;
			if (check)
				startLevel(command);
			else
				printToConsole('Command not found: ' + command);
	}
}

//TAB - автозаполнение команд
function autocompleteCommand()
{
	let matchingCommands;
	let input = inputField.value.toString()
	
	if (input.startsWith('start'))
	{
		input = input.substring(6, input.length)
		matchingCommands = levels.filter(cmd => cmd.startsWith(input));
		if (matchingCommands.length == 1)
			inputField.value = 'start ' + matchingCommands[0];
	}
	else
	{
		matchingCommands = commands.filter(cmd => cmd.startsWith(inputField.value));
		if (matchingCommands.length == 1)
			inputField.value = matchingCommands[0];
	}
	
}

//HTTP запрос
function getHTTP(api)
{
	let Http = new XMLHttpRequest();
	Http.open("GET", api, false);
	Http.send();
	let json;
	json = JSON.parse(Http.responseText);
	return json;
}

//получение списка уровней
function getLevels(json)
{
	for (let i = 0; i < JSON.stringify(json.levels.length); i++)
	{
		let temp = JSON.stringify(json.levels[i]);
		temp = temp.substring(1, temp.length - 1);
		levels[i] = temp;
	}
}

//вывод списка уровней
function printLevels(levels)
{
	for (let i = 0; i < levels.length; i++)
		printToConsole(levels[i]);
}

//запуск уровня
function startLevel(command)
{
	command = command.substring(5, command.length)
	let fl = true;
	while (fl)
		if (command[0]==' ')
			command = command.substring(1, command.length);
		else
			fl = false;
	if (levels.indexOf(command) != -1)
	{
		let params = new URLSearchParams();
		params.append("level", command);
		location.href = "game.html?" + params.toString();
	}
	else
	{
		printToConsole("incorrect level title")
		executeCommand('start');
	}
}

function funcButtons(inputField)
{
	inputField.addEventListener('keydown', function(event)
	{
		if (event.key == 'Enter')
		{
			let command = inputField.value;
			commandHistory.push(command);
			historyIndex = commandHistory.length;
			printToConsole('> ' + command);
			inputField.value = '';
			executeCommand(command);
			window.scrollTo(0, document.body.scrollHeight);
		}
		else if (event.key == 'Tab')
		{
			event.preventDefault();
			autocompleteCommand();
		}
		else if (event.key == 'ArrowUp')
		{
			event.preventDefault();
			if (historyIndex > 0)
			{
				historyIndex--;
				inputField.value = commandHistory[historyIndex];
			}
		}
		else if (event.key == 'ArrowDown')
		{
			event.preventDefault();
			if (historyIndex < commandHistory.length - 1)
			{
				historyIndex++;
				inputField.value = commandHistory[historyIndex];
			}
			else
			{
				inputField.value = '';
				historyIndex = commandHistory.length;
			}
		}
	});
}

function index()
{
	consoleDiv = document.getElementById('console');
	outputDiv = document.getElementById('output');
	inputContainer = document.querySelector('.input-container');
	inputField = document.getElementById('input');
	
	//получение списка уровней при запуске страницы
	getLevels(getHTTP(api));
	
	//фокус на поле ввода
	let keepFocus = () => inputField.focus();
	document.addEventListener('click', keepFocus);
	
	//обработка функциональных клавиш
	funcButtons(inputField);
	
	printToConsole('Welcome to the Assembly Labyrinth! Type "help" to see available commands.');
}