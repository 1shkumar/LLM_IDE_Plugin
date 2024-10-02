"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
//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
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
async function callLLM(model, prompt) {
    const apiUrl = `https://api-inference.huggingface.co/models/${model}`;
    const apiKey = vscode.workspace.getConfiguration().get('llmAssistant.apiKey') || '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';
    try {
        const response = await axios_1.default.post(apiUrl, {
            inputs: prompt
        }, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            }
        });
        return response.data[0].generated_text;
    }
    catch (error) {
        const errMessage = error.message;
        vscode.window.showErrorMessage('Error calling LLM: ' + errMessage);
        return "error!";
    }
}
// export function activate(context: vscode.ExtensionContext) {
// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "vansh" is now active!');
// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	const disposable = vscode.commands.registerCommand('vansh.helloWorld', () => {
// 		// The code you place here will be executed every time your command is executed
// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from jarvis!');
// 	});
// 	context.subscriptions.push(disposable);
// }
// This method is called when your extension is deactivated
function activate(context) {
    // Command registration
    let disposable = vscode.commands.registerCommand('llmAssistant.run', async () => {
        // Prompt user for input
        const prompt = await vscode.window.showInputBox({
            placeHolder: 'Enter your prompt for the LLM'
        });
        if (prompt) {
            const model = vscode.workspace.getConfiguration().get('llmAssistant.model') || 'gpt2';
            // Check if the model is a valid string
            if (typeof model !== 'string' || model.trim() === '') {
                vscode.window.showErrorMessage('Invalid model name. Please configure a valid model in the settings.');
                return;
            }
            const result = await callLLM(model, prompt);
            const outputChannel = vscode.window.createOutputChannel("LLM Response");
            outputChannel.appendLine(result);
            outputChannel.show();
        }
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map