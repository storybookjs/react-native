import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import decorator from '../index';

const content = decorator(() => 'Hello World!');
const wrapper = document.querySelector('#content');
ReactDOM.render(content, wrapper);
