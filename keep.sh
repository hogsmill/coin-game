#!/bin/bash

PORT=$1

while true
do
  running=`ps -ef | grep node | grep "Coin Game"`
  if [ $? -eq 0 ]
  then
    sleep 5
  else
    echo "CRASHED! Re-starting server at `date`"
    node src/server.js $PORT 'Coin Game' &
  fi
done
