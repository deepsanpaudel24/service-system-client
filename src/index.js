import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import './main.css';
import * as serviceWorker from './serviceWorker';
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { PulseLoader } from "react-spinners";

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={
      <div class="flex h-screen">
        <div class="m-auto">
          <PulseLoader size={10} color={"#6DADE3"} loading={true} />
        </div>
      </div>
    }
    >
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
