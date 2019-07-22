import * as vscode from 'vscode';


// アクティブテキストファイルの全内容を取得する
export const getFullText = () : string => {
  return getDocument().getText();
};

// アクティブテキストファイルの全内容を置き換える
export const setFullText = (newText : string) : void => {
  
  const document = getDocument();
  const invalidRange = new vscode.Range(0, 0, document.lineCount, 0);
  const fullRange = document.validateRange(invalidRange);

  const editor = getEditor();
  editor.edit(builder => builder.replace(fullRange, newText));

  // 中途半端に選択された状態になるので、選択を解除する
  editor.selection = new vscode.Selection(0, 0, 0, 0);
};

// Unicode形式にエンコードする
export const nativeToAscii = (text : string, lowerCase : boolean = true) : string => {

  return text.split('')
    .map(char => {
      if (char.charCodeAt(0) <= 127) {
        // 半角文字はそのまま
        return char;
      }

      const escaped = escape(char).replace('%', '\\');
      return lowerCase ? escaped.toLocaleLowerCase() : escaped;
    })
    .join('');
};

// Unicode形式からデコードする
export const asciiToNative = (text : string) : string => {
  return unescape(text.split('\\').join('%'));
};

// アクティブテキストエディターを取得する
export const getEditor = () : vscode.TextEditor => {
  if (vscode.window.activeTextEditor) {
    return vscode.window.activeTextEditor;
  }

  throw new Error('Text editor is not active.');
};

// アクティブテキストエディターのドキュメントを取得する
export const getDocument = () : vscode.TextDocument => {
  const editor = getEditor();
  if (editor.document) {
    return editor.document;
  }

  throw new Error('Text document is not active.');
};

// アクティブドキュメントの改行文字を取得する
export const getEol = () => {
  return getDocument().eol === vscode.EndOfLine.LF ? '\n' : '\r\n';
};

// 設定パラメータを取得する
export const getConfigParameters = (name : string) => {
  const config = vscode.workspace.getConfiguration('native-ascii-converter');
  return config.get(name);
};
