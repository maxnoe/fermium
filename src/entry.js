import React from 'react';
import ReactDOM from 'react-dom';


class Editor extends React.Component {
  render() {
    return (
      <form>
        <textarea />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

ReactDOM.render(< Editor />, document.getElementById('editor'))
