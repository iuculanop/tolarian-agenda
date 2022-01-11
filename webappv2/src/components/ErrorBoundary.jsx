import React from 'react';

const assistanceEMailAddress = 
    'mailto:grupposvil@unimi.it?subject=%5BDomandaTelelavoro%2FFE%5D%20Richiesta%20assistenza';

class ErrorBoundary extends React.Component {
  state = { error: false };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
        console.warn('stato di errore: ', this.state.error.message);
        const unAuthenticated = (this.state.error.message.includes('return statement') || this.state.error.message.includes('Minified') ? true : false);
        if (!unAuthenticated) return (
          <div style={{ padding: '2em 0' }}>
            <div
              style={{
                padding: '1em 2em',
                margin: 'auto',
                maxWidth: '720px',
                backgroundColor: '#fff1f0',
                border: '1pt solid #cf1322',
                borderRadius: '4px',
              }}
            >
              <h1 style={{ color: '#cf1322', textAlign: 'center' }}>
                Si è verificato un errore{' '}
                <span role="img" aria-label="Faccina triste">
                  🙁
                </span>
              </h1>
              <div>
                <b>Dettaglio:</b>
                <pre style={{ width: '100%', overflow: 'auto' }}>
                  {this.state.error.toString
                    ? this.state.error.toString()
                    : JSON.stringify(this.state.error)}
                </pre>
              </div>
              <p>
                Provare a <a style={{ color: '#003366' }} href={window.location.href}>ricaricare la pagina</a>{' '}
                e se l'errore persiste{' '}
                <a style={{ color: '#003366' }} href={assistanceEMailAddress}>contattare l'assistenza</a>{' '}
                copiando e incollando il messaggio qui sopra.
              </p>
            </div>
          </div>
        );
        return (<div style={{ padding: '2em 0' }}>
        <div
          style={{
            padding: '1em 2em',
            margin: 'auto',
            maxWidth: '720px',
            backgroundColor: 'rgb(235, 240, 246);',
            border: '1pt solid #003366',
            borderRadius: '4px',
          }}
        >
          <h1 style={{ color: '#003366', textAlign: 'center' }}>
            Connessione al CAS in corso...
          </h1>
          <div>
            <pre style={{ width: '100%', overflow: 'auto', textAlign: 'center'}}>
              In attesa della risposta del servizio di autenticazione UNIMI
            </pre>
          </div>
        </div>
      </div>)
    }
    return this.props.children;
  }
}

export default ErrorBoundary;