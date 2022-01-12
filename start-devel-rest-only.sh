#!/bin/bash

RESTDIR="REST"
FEDIR="WEBAPP/"
HOMEDIR=`pwd`
GOPATH=$HOMEDIR/$RESTDIR

echo $HOMEDIR
echo $GOPATH

#starting REST Server
cd $HOMEDIR/$RESTDIR/
export GOPATH

go run src/elmariachistudios.it/mtg-organizer/mtgOrganizer.go -logdir $GOPATH/log/mtgorganizer.log 
