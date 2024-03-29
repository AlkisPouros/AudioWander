import React from 'react';
import ReactDOM from 'react-dom/client';
import { Drumkit } from './drumkit/Drumkit';
import { Header } from './Header';
import { ModularSynthesizer } from './synthesizer/ModularSynthesizer';
import { Recorder } from './audio/Recorder';

import './style.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Header />
    <Recorder />
    <Drumkit />
    <ModularSynthesizer />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

