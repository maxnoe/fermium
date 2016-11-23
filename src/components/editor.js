import React from "react";
import {spawn} from "child-process-promise";
import tmp from "tmp-promise";
import write from "fs-writefile-promise";
import path from "path";
import {remote, ipcRenderer} from 'electron';

import ace from 'brace';

require('brace/mode/latex');
require('brace/theme/monokai');


var tex_options = ['--halt-on-error', '--interaction=nonstopmode']
var dvipng_options = ['-D', '1200', '-T', 'tight', '-o', 'formula.png']
var latex_template = {
  before : "\\documentclass{scrartcl}\\pagestyle{empty}\\usepackage[utf8]{inputenc}\\usepackage[T1]{fontenc}\n\\usepackage{mathtools}\\usepackage{lmodern}\\begin{document}\\begin{align*}",
  after: "\\end{align*}\\end{document}"
}

var cleanup;
remote.getCurrentWindow().on('close', () => {
  if (typeof cleanup !== 'undefined') cleanup();
})


export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typingTimeout: 2000,
      formula: "a^2 + b^2 = c^2"
    };
    this.runLaTeX();
  }

  componentDidMount() {
    this.setState({editor: ace.edit("editor")}, () => {
      console.log(this.state);
      this.state.editor.getSession().setMode('ace/mode/latex');
      this.state.editor.setTheme('ace/theme/monokai');
      this.state.editor.on('change', this.handleChange.bind(this));
    });
  }
  
  render() {
    return (
      <div className="app">
        <div className="editor" id="editor"></div>
        <div className="preview">
          <a href="#" id="drag" onDragStart={this.handleDrag.bind(this)}>
            <img src={this.state.image} alt="" />
          </a>
        </div>
      </div>
    );
  }

  handleDrag(event){
    event.preventDefault();
    ipcRenderer.send('ondragstart', this.state.image);
  }

  handleChange(event) {
    this.setState({formula: this.state.editor.getValue()});
    clearTimeout(this.state.typingTimer);
    this.state.typingTimer = setTimeout(this.doneTyping.bind(this), this.state.typingTimeout);
    console.log("Change");
  }

  doneTyping() {
    console.log(this.state.formula);
    this.runLaTeX();
  }

  runLaTeX() {
    tmp.dir({unsafeCleanup: true})
    .then((dir) => {
      console.log(dir.path);
      this.state.directory = dir.path;
      var texfile = path.join(dir.path, 'formula.tex');
      var texcode = latex_template.before + this.state.formula + latex_template.after;
      if (typeof cleanup !== 'undefined'){
        cleanup();
      }
      cleanup = dir.cleanup;
      return write(texfile, texcode);
    })
    .then((texfile) => {
      console.log(texfile);
      return spawn('latex', tex_options.concat([texfile]), {cwd: this.state.directory});
    })
    .then(() => {
      var dvifile = path.join(this.state.directory, 'formula.dvi');
      console.log(dvifile);
      return spawn("dvipng", dvipng_options.concat([dvifile]), {cwd: this.state.directory});
    })
    .then(() => {
      console.log("Updated image path");
      this.setState({image: path.join(this.state.directory, 'formula.png')});
    })
    .catch((err) => console.log('ERROR: ', err))
  }

}
