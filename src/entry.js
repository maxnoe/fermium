'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import Editor from '../components/editor';



ReactDOM.render(< Editor />, document.getElementById('editor'))


document.addEventListener('dragover', function (event) {
  event.preventDefault();
  return false;
}, false);

document.addEventListener('drop', function (event) {
  event.preventDefault();
  return false;
}, false);
