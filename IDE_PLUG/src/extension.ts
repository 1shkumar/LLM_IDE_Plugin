// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
async function callLLM(model: string, prompt: string): Promise<string> {
	const apiUrl = `https://api-inference.huggingface.co/models/${model}`;
    const apiKey = vscode.workspace.getConfiguration().get('llmAssistant.apiKey') || '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';
	try {
        const response = await axios.post(apiUrl, {
            inputs: prompt
        }, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            }
        });

        return response.data[0].generated_text;
    } catch (error) {
        const errMessage = (error as Error).message;
        vscode.window.showErrorMessage('Error calling LLM: ' + errMessage);
		return "error!";
    }
}


export function activate(context: vscode.ExtensionContext) {
    // Command registration
    let disposable = vscode.commands.registerCommand('llmAssistant.run', async () => {
        // Prompt user for input
        const prompt = await vscode.window.showInputBox({
            placeHolder: 'Enter your prompt for the LLM'
        });

        if (prompt) {
            
            const model: string = vscode.workspace.getConfiguration().get('llmAssistant.model') || 'gpt2';

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
export function deactivate() {}
