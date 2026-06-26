/* global document */

import { registerRootComponent } from 'expo';

import App from './src/App';

if (typeof document !== 'undefined') {
  const style = document.createElement('style');

  style.textContent = `
    html,
    body,
    #root {
      height: 100%;
      margin: 0;
      overflow: hidden;
      overscroll-behavior: none;
    }

    #root {
      display: flex;
    }
  `;

  document.head.appendChild(style);
}

registerRootComponent(App);
