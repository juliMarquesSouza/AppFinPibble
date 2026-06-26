/* global document, navigator, window */

import { registerRootComponent } from 'expo';

import App from './src/App';

if (typeof document !== 'undefined') {
  document.title = 'FinPibble';

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

  const metadata = [
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ['link', { rel: 'apple-touch-icon', href: '/pwa-icon-192.png' }],
    ['meta', { name: 'theme-color', content: '#7C6AED' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'FinPibble' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }]
  ];

  metadata.forEach(([tagName, attributes]) => {
    const element = document.createElement(tagName);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
    document.head.appendChild(element);
  });
}

const canUseServiceWorker =
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  (window.location.protocol === 'https:' || window.location.hostname === 'localhost');

if (canUseServiceWorker) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  });
}

registerRootComponent(App);
