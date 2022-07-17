import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://37957ed3b3cb4c888795d62b0d532a3b@o1322033.ingest.sentry.io/6579083",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.2,
});

export const sendDataToSentry = ({ name, message, extra, tags }, operation) => {
  // if (process.env.NODE_ENV === 'development') {
  //   return;
  // }
  const error = new Error();
  error.message = message;
  error.name = name;
  if (!tags) tags = {};
  tags.severity = getErrorSeverity(
    error,
    { name, message, extra, tags },
    operation
  );
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
