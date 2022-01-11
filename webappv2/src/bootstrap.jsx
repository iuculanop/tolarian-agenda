import ReactDOM from 'react-dom';
import { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { LocaleProvider } from 'antd';
import it_IT from 'antd/es/locale-provider/it_IT';

import MeProvider from './context/MeProvider';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';


const fallback = (
    <p style={{ textAlign: 'center', padding: '3em 0' }}>
      Caricamento in corso...
    </p>
);

// console.warn('path base:', basepath);
ReactDOM.render(
  <Router>
      <LocaleProvider locale={it_IT}>
        <ErrorBoundary>
          <Suspense fallback={fallback}>
              <MeProvider>
                <App />
              </MeProvider>
          </Suspense>
        </ErrorBoundary>
      </LocaleProvider>
  </Router>,
  document.getElementById('root')
);