TOLARIAN AGENDA
=================

Semplice applicazione web composta da una parte frontend (sviluppata con React,Redux e Antd) e un servizio REST sviluppato in GO.


OPERAZIONI PRELIMINARI
======================

Per poter utilizzare l'applicazione in ambiente locale è necessario effettuare:
* l'installazione di GO e dei pacchetti necessari al servizio REST
* l'installazione dei pacchetti npm necessari alla parte frontend
* il caricamento del dump sql in un istanza di mysql server locale.

A. GO
-----
Per compilare è necessario aver installato:
* GO versione 1.8 o superiore [http://golang.org/doc/install][GO binari]

[GO binari]: http://golang.org/doc/install

Dopo aver installato GO è necessario installare i package di GO necessari al servizio REST.
* entrare nella directory REST ed esportare la variabile 
`export GOPATH=pathdella directory corrente`
* eseguire il comando `go get -u github.com/gorilla/mux`
* eseguire il comando `go get -u github.com/go-sql-driver/mysql`
* eseguire il comando `go get github.com/MagicTheGathering/mtg-sdk-go`
* eseguire il comando `go get github.com/auth0/go-jwt-middleware`
* eseguire il comando `go get github.com/dgrijalva/jwt-go `

Si ricorda che per il momento viene utilizzato come ambiente di sviluppo, per cui non è necessario fare la compilazione del codice sorgente

B. NPM
------
to be written

USO
===

Dopo avere effettuato le operazioni preliminari, lanciare il comando :

`
$ ./start-devel.sh
`


