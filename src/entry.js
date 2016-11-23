'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import Editor from './components/editor';
var css = require('./stylesheets/main.scss')



ReactDOM.render(< Editor />, document.getElementById('app'))


document.addEventListener('dragover', function (event) {
  event.preventDefault();
  return false;
}, false);

document.addEventListener('drop', function (event) {
  event.preventDefault();
  return false;
}, false);
