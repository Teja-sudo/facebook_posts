import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.2,
});

export const sendDataToSentry = ({ name, message, extra, tags }, operation) => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  const error = new Error();
  error.message = message;
  error.name = name;
  if (!tags) tags = {};
  // Sentry called
  Sentry.captureException(error, {
    tags,
    extra,
  });
};
console.log(process.env.NODE_ENV)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
