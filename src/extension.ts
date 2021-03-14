// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { NONAME } from 'node:dns';
import { stringify } from 'node:querystring';
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "jsonutil-vscode-ext" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('jsonutil-vscode-ext.composed', () => {
		// The code you place here will be executed every time your command is executed
		json2Str_cmd()
	});

	context.subscriptions.push(disposable);
}

// 将json对象转换成str 执行函数
function json2Str_cmd() {
	const editor = vscode.window.activeTextEditor
	if (editor) {
		const document = editor.document
		const selection = editor.selection
		const selec_words = document.getText(selection)
		if (selec_words.length == 0) {
			return
		}

		let changed_str = changeJson2Str(selec_words)
		console.log(changed_str as string)
		if (changed_str == null) {
			vscode.window.showErrorMessage("所选部分不是标准json！")
		} else {
			editor.edit(edit_builder => {
				edit_builder.replace(selection, changed_str as string);
			})
		}
	}

}

// 将json对象转换成str
function changeJson2Str(str: string): string | null {
	let res: string = ""
	let i = 0
	while (i < str.length) {
		let ch = str[i]

		if (ch == ' ' || ch == '\n' || ch == '\r' || ch == '\t') {
			i += 1
			continue
		} else if (ch == '"') {
			let temp_str: string = "\\\""
			let j = i + 1
			while (j < str.length) {
				if (str[j] == "\"") {
					if (str[j - 1] != "\\") {
						break
					}
				}
				temp_str += str[j]
				j += 1
			}

			if (j >= str.length || str[j] != '\"') {
				return null
			}
			temp_str += "\\\""
			res += temp_str
			i = j + 1
		} else if (ch == '\\') {
			return null
		} else {
			res += ch
			i += 1
		}
	}
	return "\"" + res + "\"" + '\n'
}

// this method is called when your extension is deactivated
export function deactivate() { }
