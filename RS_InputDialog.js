/*:
 * RS_InputDialog.js
 * @plugindesc RS.InputDialog.js (plugin in development)
 * @author biud436
 *
 * @param textBox Width
 * @desc
 * @default 488
 *
 * @param textBox Height
 * @desc
 * @default 36
 *
 * @param variable ID
 * @desc
 * @default 3
 *
 * @param debug
 * @desc
 * @default false
 *
 * @param Text
 * @desc
 * @default Please enter the value...
 *
 * @help
 * =============================================================================
 * Plugin Commands
 * =============================================================================
 * InputDialog open
 * InputDialog width 488
 * InputDialog text Please enter the string...
 * InputDialog variableID 3
 * InputDialog debug true
 * =============================================================================
 * Change Log
 * =============================================================================
 * 2016.08.09(v1.0.0) - First Release.
 */

var Imported = Imported || {};
Imported.RS_InputDialog = true;

var RS = RS || {};
RS.InputDialog = RS.InputDialog || {};

function Scene_InputDialog() {
  this.initialize.apply(this, arguments);
}

(function () {

  var parameters = PluginManager.parameters('RS_InputDialog');
  var textBoxWidth = Number(parameters['textBox Width'] || 488);
  var textBoxHeight = Number(parameters['textBox Height'] || 36);
  var variableID = Number(parameters[''] || 3);
  var debug = Boolean(parameters['debug'] === 'true');
  var localText = String(parameters['Text'] || 'Test Message');

  var original_Input_shouldPreventDefault = Input._shouldPreventDefault;
  var dialog_Input_shouldPreventDefault = function(keyCode) {
      switch (keyCode) {
      case 33:    // pageup
      case 34:    // pagedown
      case 37:    // left arrow
      case 38:    // up arrow
      case 39:    // right arrow
      case 40:    // down arrow
          return true;
      }
      return false;
  };

  // private class
  function TextBox() {
    this.initialize.apply(this, arguments);
  };

  TextBox.BACK_SPACE = 8;
  TextBox.ENTER = 13;
  TextBox.IS_NOT_CHAR = 32;
  TextBox.KEYS_ARRAY = 255;

  TextBox.prototype.initialize = function()  {
    this.prepareElement();
    this.createTextBox();
    this.getFocus();
    this.setRect();
    this.startToConvertInput();
  };

  TextBox.prototype.startToConvertInput = function () {
    Input._shouldPreventDefault = dialog_Input_shouldPreventDefault;
  };

  TextBox.prototype.startToOriginalInput = function () {
    Input._shouldPreventDefault = original_Input_shouldPreventDefault;
  };

  TextBox.prototype.createTextBox = function() {
    this._textBox = document.createElement('input');
    this._textBox.type = "text";
    this._textBox.id = "md_textBox";
    this._textBox.style.opacity = 255;
    this._textBox.style.zIndex = 1000;
    this._textBox.autofocus = false;
    this._textBox.multiple = false;
    this._textBox.style.imeMode = 'active';
    this._textBox.style.position = 'absolute';
    this._textBox.style.top = 0;
    this._textBox.style.left = 0;
    this._textBox.style.right = 0;
    this._textBox.style.bottom = 0;
    this._textBox.style.fontSize = (textBoxHeight - 4) + 'px';
    this._textBox.style.width = textBoxWidth + 'px';
    this._textBox.style.height = textBoxHeight + 'px';

    // 키를 눌렀을 때의 처리
    this._textBox.onkeydown = this.onKeyDown.bind(this);

    // 화면에 에디트박스를 표시한다.
    var field = document.getElementById('md_inputField');
    field.appendChild(this._textBox);

    // 에디트 박스를 캔버스 중앙에 정렬합니다.
    Graphics._centerElement(this._textBox);

    window.onresize = function () {
      if(SceneManager._scene instanceof Scene_InputDialog) {
        var field = document.getElementById('md_inputField');
        var textBox = document.getElementById('md_textBox');
        if(field && textBox) {
            Graphics._centerElement(field);
            Graphics._centerElement(textBox);
            textBox.style.fontSize = (textBoxHeight - 4) + 'px';
            textBox.style.width = textBoxWidth + 'px';
            textBox.style.height = textBoxHeight + 'px';
        }
      }
    };

  };

  TextBox.prototype.setRect = function () {
    var textBox = document.getElementById('md_textBox');
    textBox.style.fontSize = (textBoxHeight - 4) + 'px';
    textBox.style.width = textBoxWidth + 'px';
    textBox.style.height = textBoxHeight + 'px';
  };

  TextBox.prototype.prepareElement = function() {
    var field = document.createElement('div');
    field.id = 'md_inputField';
    field.style.position = 'absolute';
    field.style.left = '0';
    field.style.top = '0';
    field.style.right = '0';
    field.style.bottom = '0';
    field.style.width = Graphics.boxWidth + 'px';
    field.style.height = Graphics.boxHeight + 'px';
    field.style.zIndex = "1000";
    document.body.appendChild(field);
    Graphics._centerElement(field);
    return field;
  };

  TextBox.prototype.setEvent = function(func) {
    var textBox = document.getElementById('md_textBox');
    textBox.onchange = func;
    this._func = func;
  };

  TextBox.prototype.terminateTextBox = function() {
    var field = document.getElementById('md_inputField');
    var textBox = document.getElementById('md_textBox');
    field.removeChild(textBox);
    document.body.removeChild(field);
    this.startToOriginalInput();
  };

  TextBox.prototype.onKeyDown = function(e) {

    var keyCode = e.which;

    // this.getFocus();

    if (keyCode < TextBox.IS_NOT_CHAR) {

      // 결정키를 눌렸는가?
      if(keyCode === TextBox.ENTER) {

        // 텍스트가 없으면 결정키 눌림이 취소된다.
        // if(this.getTextLength() <= 0) {
        //   e.preventDefault();
        // }

        // 버튼 입력 체크
        if(this._func instanceof Function) this._func();

      }

    }

  }

  TextBox.prototype.getTextLength = function() {
    var textBox = document.getElementById('md_textBox');
    return textBox.value.length;
  };

  TextBox.prototype.getFocus = function() {
    var textBox = document.getElementById('md_textBox');
    textBox.focus();
  };

  TextBox.prototype.getText = function () {
    var textBox = document.getElementById('md_textBox');
    return textBox.value;
  };

  TextBox.prototype.terminate =  function() {
    this.terminateTextBox();
  };

  //============================================================================
  //
  //
  //
  function Window_DialogHelp() {
      this.initialize.apply(this, arguments);
  }

  Window_DialogHelp.prototype = Object.create(Window_Help.prototype);
  Window_DialogHelp.prototype.constructor = Window_DialogHelp;

  Window_DialogHelp.prototype.initialize = function(numLines) {
    Window_Help.prototype.initialize.call(this, numLines);
  };

  Window_DialogHelp.prototype.textWidthEx = function(text) {
      return this.drawTextEx(text, 0, this.contents.height);
  };

  Window_Help.prototype.refresh = function() {
    this.contents.clear();
    var w = this.textWidthEx(this._text);
    var x = this.width - w - (w / 2);
    this.drawTextEx(this._text, x + this.textPadding(), 0);
  };

  //============================================================================
  // Scene_InputDialog
  //
  //

  Scene_InputDialog.prototype = Object.create(Scene_Base.prototype);
  Scene_InputDialog.prototype.constructor = Scene_InputDialog;

  Scene_InputDialog.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
  };

  Scene_InputDialog.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createWindowLayer();
    this.createText();
    this.createTextBox();
  };

  Scene_InputDialog.prototype.terminate = function () {
    Scene_Base.prototype.terminate.call(this);
    this._textBox.terminate();
    this._textBox = null;
  };

  Scene_InputDialog.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._backgroundSprite.opacity = 128;
    this.addChild(this._backgroundSprite);
  };

  Scene_InputDialog.prototype.createText = function () {
    this._text = new Window_DialogHelp(2);
    this._text.x = Graphics.boxHeight / 2 - this._text.width / 2;
    this._text.y = Graphics.boxHeight / 2 - textBoxHeight - this._text.height;
    this._text.setText(localText);
    this._text.backOpacity = 0;
    this._text._windowFrameSprite.alpha = 0;
    this.addWindow(this._text);
  };

  Scene_InputDialog.prototype.createTextBox = function () {
    this._textBox = new TextBox();
    this._textBox.setEvent(this.okResult.bind(this));
  };

  Scene_InputDialog.prototype.okResult = function () {
    var text = this._textBox.getText() || '';
    $gameVariables.setValue(variableID, text);

    if(debug) {
      window.alert(text);
    }

    if(SceneManager._stack.length > 0) {
      Input.clear();
      this.popScene();
    };

  };

  //============================================================================
  // Game_Interpreter
  //
  //

  var alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
      alias_Game_Interpreter_pluginCommand.call(this, command, args);
      if(command === "InputDialog") {
        switch(args[0]) {
          case 'open':
            SceneManager.push(Scene_InputDialog);
            break;
          case 'width':
            textBoxWidth = Number(args[1] || 488);
            break;
          case 'text':
            localText = args.slice(1, args.length).join('');
            break;
          case 'variableID':
            variableID = Number(args[1] || 3);
            break;
          case 'debug':
            debug = Boolean(args[1] === 'true');
            break;
        }
      }
  };


})();