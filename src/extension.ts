'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const path = require('path');
const fs = require('fs');

function htmlEncode(str) {
  var s = '';
  if (str.length == 0) return '';
  s = str.replace(/&/g, '&amp;');
  s = s.replace(/</g, '&lt;');
  s = s.replace(/>/g, '&gt;');
  s = s.replace(/ /g, '&nbsp;');
  s = s.replace(/\'/g, '&#39;');
  s = s.replace(/\"/g, '&quot;');
  return s;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let previewUri = vscode.Uri.parse('regexper-preview://authority/regexper-preview');
  let isLoading = true;
  let expression = '';

  class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    public provideTextDocumentContent(uri: vscode.Uri): string {
      return this.snippet();
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
      return this._onDidChange.event;
    }

    public update(uri: vscode.Uri) {
      this._onDidChange.fire(uri);
    }

    private errorSnippet(error: string): string {
      return `<body> ${error} </body>`;
    }

    protected snippet(): string {
      var data = fs.readFileSync(path.join(__dirname, '../../assets', 'index.js.txt'));
      const lib = data.toString();

      if (expression === '') {
        return `<body> no expression </body>`;
      }

      const testHtml = `
      <!DOCTYPE html>
      <meta charset="utf-8">
      <link href="https://cdn.bootcss.com/highlight.js/9.12.0/styles/github.min.css" rel="stylesheet">
      <style>
      #error {
        background: #b3151a;
        color: #fff;
        padding: 0.5em;
        white-space: pre;
        font-family: monospace;
        font-weight: bold;
        display: none;
        overflow-x: auto; }
      .progress {
        width: 50%;
        height: 0.75em;
        border: 1px solid #8ca440;
        overflow: hidden;
        margin: 1.5em auto; }
        .progress div {
          background: #bada55;
          background: linear-gradient(135deg, #bada55 25%, #cbe380 25%, #cbe380 50%, #bada55 50%, #bada55 75%, #cbe380 75%, #cbe380 100%);
          background-size: 3em 3em;
          background-repeat: repeat-x;
          height: 100%;
          animation: progress 1s infinite linear; }
      #regexp-render {
        background: #fff;
        width: 100%;
        overflow: auto;
        text-align: center;
      }
      svg {
        background-color: #fff; }
      
      .root text,
      .root tspan {
        font: 12px Arial; }
      
      .root path {
        fill-opacity: 0;
        stroke-width: 2px;
        stroke: #000; }
      
      .root circle {
        fill: #6b6659;
        stroke-width: 2px;
        stroke: #000; }
      
      .anchor text, .any-character text {
        fill: #fff; }
      
      .anchor rect, .any-character rect {
        fill: #6b6659; }
      
      .escape text, .charset-escape text, .literal text {
        fill: #000; }
      
      .escape rect, .charset-escape rect {
        fill: #bada55; }
      
      .literal rect {
        fill: #dae9e5; }
      
      .charset .charset-box {
        fill: #cbcbba; }
      
      .subexp .subexp-label tspan,
      .charset .charset-label tspan,
      .match-fragment .repeat-label tspan {
        font-size: 10px; }
      
      .repeat-label {
        cursor: help; }
      
      .subexp .subexp-label tspan,
      .charset .charset-label tspan {
        dominant-baseline: text-after-edge; }
      
      .subexp .subexp-box {
        stroke: #908c83;
        stroke-dasharray: 6,2;
        stroke-width: 2px;
        fill-opacity: 0; }
      
      code {
          font-size:18px;
      }
      </style>
      <pre><code class="js">${htmlEncode(expression)}</code></pre>
      <input id="expression" type="hidden" value="${encodeURI(expression)}" />
      <div id="regexp-render"></div>
      <div id="error"></div>
      <script type="text/html" id="svg-container-base">
        <div class="svg">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:cc="http://creativecommons.org/ns#"
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            version="1.1">
            <defs>
                <style type="text/css">svg {
            background-color: #fff; }
        
        .root text,
        .root tspan {
            font: 12px Arial; }
        
        .root path {
            fill-opacity: 0;
            stroke-width: 2px;
            stroke: #000; }
        
        .root circle {
            fill: #6b6659;
            stroke-width: 2px;
            stroke: #000; }
        
        .anchor text, .any-character text {
            fill: #fff; }
        
        .anchor rect, .any-character rect {
            fill: #6b6659; }
        
        .escape text, .charset-escape text, .literal text {
            fill: #000; }
        
        .escape rect, .charset-escape rect {
            fill: #bada55; }
        
        .literal rect {
            fill: #dae9e5; }
        
        .charset .charset-box {
            fill: #cbcbba; }
        
        .subexp .subexp-label tspan,
        .charset .charset-label tspan,
        .match-fragment .repeat-label tspan {
            font-size: 10px; }
        
        .repeat-label {
            cursor: help; }
        
        .subexp .subexp-label tspan,
        .charset .charset-label tspan {
            dominant-baseline: text-after-edge; }
        
        .subexp .subexp-box {
            stroke: #908c83;
            stroke-dasharray: 6,2;
            stroke-width: 2px;
            fill-opacity: 0; }
        
        .quote {
            fill: #908c83; }
        </style>
            </defs>
            <metadata>
                <rdf:RDF>
                <cc:License rdf:about="http://creativecommons.org/licenses/by/3.0/">
                    <cc:permits rdf:resource="http://creativecommons.org/ns#Reproduction" />
                    <cc:permits rdf:resource="http://creativecommons.org/ns#Distribution" />
                    <cc:requires rdf:resource="http://creativecommons.org/ns#Notice" />
                    <cc:requires rdf:resource="http://creativecommons.org/ns#Attribution" />
                    <cc:permits rdf:resource="http://creativecommons.org/ns#DerivativeWorks" />
                </cc:License>
                </rdf:RDF>
            </metadata>
            </svg>
        </div>
        <div class="progress">
            <div style="width:0;"></div>
        </div>
        </script>
      <script>${lib}</script>
      <script src="https://cdn.bootcss.com/highlight.js/9.12.0/highlight.min.js"></script>
      <script>hljs.initHighlightingOnLoad();</script>
`;

      return testHtml;
    }
  }

  let provider = new TextDocumentContentProvider();
  let registration = vscode.workspace.registerTextDocumentContentProvider('regexper-preview', provider);

  let disposable = vscode.commands.registerCommand('extension.showRegexper', () => {
    var editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showInformationMessage('Open a file first!');
      return;
    }

    let selection = editor.selection;
    let text = editor.document.getText(selection).trim();

    // 支持js构造函数的形式
    // todo: 支持其他语言的正则构造形式
    let reg = /^new RegExp\(([\s\S]+)\);?$/;
    if (reg.test(text)) {
      let tmp = new Function(`return ${text}`);
      text = tmp().toString();
    }

    if (expression === '') {
      // 第一次显示
      expression = text;
      vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, 'RegExp Preview').then(
        success => {},
        reason => {
          vscode.window.showErrorMessage(reason);
        }
      );
    } else {
      expression = text;
      provider.update(previewUri);
    }
  });

  vscode.commands.registerCommand('extension.regexpEditor', () => {
    vscode.workspace
      .openTextDocument({
        content: '//',
        language: 'JavaScript',
      })
      .then(doc => {
        return vscode.window.showTextDocument(doc);
      })
      .then(() => {
        var editor = vscode.window.activeTextEditor;

        if (!editor) {
          vscode.window.showInformationMessage('Open a file first!');
          return;
        }

        var text = editor.document.getText().trim();

        vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
          if (e.document === vscode.window.activeTextEditor.document) {
            provider.update(previewUri);
          }
        });

        if (expression === '') {
          // 第一次显示
          expression = text;
          vscode.commands
            .executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, 'RegExp Preview')
            .then(
              success => {},
              reason => {
                vscode.window.showErrorMessage(reason);
              }
            );
        } else {
          expression = text;
          provider.update(previewUri);
        }
      });
  });

  context.subscriptions.push(disposable, registration);
}

// this method is called when your extension is deactivated
export function deactivate() {}
