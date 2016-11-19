import React from 'react';
import ReactDOM from 'react-dom';


class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typingTimeout: 2000,
    };
  }

  render() {
    return (
      <form>
        <textarea onChange={this.handleChange.bind(this)}/>
      </form>
    );
  }

  handleChange() {
    clearTimeout(this.state.typingTimer);
    this.state.typingTimer = setTimeout(this.doneTyping, this.state.typingTimeout);
    console.log("Change");
  }

  doneTyping() {
    console.log("done typing");
  }

}

ReactDOM.render(< Editor />, document.getElementById('editor'))
