//список команд
const commands = ['help', 'clear', 'version', 'levels', 'start'];

//список уровней
var levels = new Array();

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
			printToConsole('List of levels:');
			printLevels(json);
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
	let input = inputField.value;
	let matchingCommands = commands.filter(cmd => cmd.startsWith(input));
	if (matchingCommands.length == 1)
		inputField.value = matchingCommands[0];
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