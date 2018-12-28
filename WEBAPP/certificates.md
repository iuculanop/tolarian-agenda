Generazione di certificati
==========================

Vi sono due possibilità:

1. generazione di certificati riconosciuti da una CA tramite Let's Encrypt;
2. generazione di certificati self-signed.

Nel primo caso i certificati sono riconosciuti nelle CA dei browser più recenti, però
scadono dopo 90gg (rinnovo automatico possibile), richiedono un FQDN riconosciuto
dall'esterno e la porta HTTPS (443) accessibile dall'esterno.
Nel secondo caso, i certificati non sono riconosciuti dai browser ed è necessario dargli
fiducia manualmente.

*Nota:* sia frontend sia backend devono utilizzare lo stesso certificato se sono sulla
stessa macchina (altrimenti il browser si arrabbia).


Generazione tramite Let's Encrypt
----------------------------------------

0. Variabili da settare:

    MYFQDN=$(hostname -A | head -n1)
    FRONTENDDIR=...   # la directory del frontend
    BACKENDDIR=...   # la directory del backend

1. Ottenere un certificato da Let's Encrypt (https://https://letsencrypt.org/):
   (*Nota:* la porta 443 deve essere libera e accessibile dall'esterno)

    sudo letsencrypt certonly --standalone -d $MYFQDN
    ## Poi, per il rinnovo:
    # sudo letsencrypt renew --standalone

2. Let's Encrypt dovrebbe aver messo i certificati nei file seguenti:
   (*Nota:* non sono leggibili da utenti non-root)

    # Chiave privata
    /etc/letsencrypt/live/$MYFQDN/privkey.pem
    # Certificato server
    /etc/letsencrypt/live/$MYFQDN/fullchain.pem
    # Certificato CA
    /etc/letsencrypt/live/$MYFQDN/chain.pem

3. Copiare i file nella directory `cert/` del frontend per essere usati dal
   server HTTPS che fa partire Node.js

    cd $FRONTENDDIR
    mkdir -p cert/
    sudo cp /etc/letsencrypt/live/$MYFQDN/{chain,fullchain,privkey}.pem cert/
    cd cert/

4. Importare il certificato nel keystore usato da Java:

    cd $BACKENDDIR
    mkdir -p cert/
    cd cert/
    openssl pkcs12 -export                    \
      -out certificate.pfx                    \
      -inkey $FRONTENDDIR/cert/privkey.pem    \
      -in $FRONTENDDIR/cert/fullchain.pem     \
      -certfile $FRONTENDDIR/cert/chain.pem   \
      -name selfsigned                        \
      -password pass:changeit

    keytool -importkeystore                   \
      -srcstorepass changeit                  \
      -deststorepass changeit                 \
      -destkeypass changeit                   \
      -srckeystore certificate.pfx            \
      -srcstoretype PKCS12                    \
      -alias selfsigned                       \
      -keystore keystore.jks

5. Per gestire le connessioni dal backend ad altri servizi HTTPS con certificati non
   validi (self-signed, come il CAS di test) è necessario inserirli nel file
   `$BACKENDDIR/cert/cacerts` con il comando:

    keytool -import                          \
      -trustcacerts                          \
      -alias <SOME ALIAS>                    \
      -file <CERTIFICATE FILE>               \
      -keystore cacerts                      \
      -deststorepass changeit

5. Inserire nel file di configurazione le seguenti direttive in `applicationConnectors`

    - type: https
      port: 8443
      keyStorePath: cert/keystore.jks
      keyStorePassword: changeit
      trustStorePath: cert/cacerts
      certAlias: selfsigned
      validateCerts: false

7. Per lanciare il backend Java su HTTPS si posso usare questi comandi:

    cd $BACKENDDIR
    java -Djavax.net.ssl.trustStore=cert/cacerts -jar <JARFILE> server <YAML file>


Generazione self-signed
-----------------------

0. Variabili da settare:

    FRONTENDDIR=...   # la directory del frontend
    BACKENDDIR=...   # la directory del backend

1. Generare il proprio certificato SSL/TLS

    cd $FRONTENDDIR
    mkdir -p cert
    cd cert
    openssl genrsa -out privkey.pem 1024
    openssl req -new -key privkey.pem -out privkey.csr
    openssl x509 -req -days 3660 -in privkey.csr -signkey privkey.pem -out fullchain.pem

2. Esportare il certificato self-signed per poterlo importare come CA

    cd $BACKENDDIR
    mkdir -p cert/
    cd cert/
    openssl pkcs12 -export                    \
      -out certificate.pfx                    \
      -inkey $FRONTENDDIR/cert/privkey.pem    \
      -in $FRONTENDDIR/cert/fullchain.pem     \
      -name selfsigned                        \
      -password pass:changeit

    keytool -importkeystore                   \
      -srcstorepass changeit                  \
      -deststorepass changeit                 \
      -destkeypass changeit                   \
      -srckeystore certificate.pfx            \
      -srcstoretype PKCS12                    \
      -alias selfsigned                       \
      -keystore keystore.jks

3. Importare il certificato self-signed nella lista delle CA riconosciute

    cat $FRONTENDDIR/cert/{fullchain,privkey}.pem > combined.pem
    keytool -import             \
      -trustcacerts             \
      -alias selfsigned         \
      -file combined.pem        \
      -keystore cacerts         \
      -deststorepass changeit

4. Per gestire le connessioni dal backend ad altri servizi HTTPS con certificati non
   validi (self-signed, come il CAS di test) è necessario inserirli nel file
   `$BACKENDDIR/cert/cacerts` con il comando:

    keytool -import                          \
      -trustcacerts                          \
      -alias <SOME ALIAS>                    \
      -file <CERTIFICATE FILE>               \
      -keystore cacerts                      \
      -deststorepass changeit

5. Inserire nel file di configurazione le seguenti direttive in `applicationConnectors`

    - type: https
      port: 8443
      keyStorePath: cert/keystore.jks
      keyStorePassword: changeit
      trustStorePath: cert/cacerts
      certAlias: selfsigned
      validateCerts: false

6. Per lanciare il backend Java su HTTPS si posso usare questi comandi:

    cd $BACKENDDIR
    java -Djavax.net.ssl.trustStore=cert/cacerts -Djavax.net.ssl.trustAnchors=cert/cacerts -jar <JARFILE> server <YAML file>
