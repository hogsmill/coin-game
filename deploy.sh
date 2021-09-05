#!/bin/bash

FORCE=false
OUTDATED=true
while [ $1 ]
do
  echo $1
  if [ "$1" == "-f" ]; then
    FORCE=true
  fi
  shift
done

REPO="https://github.com/hogsmill/coin-game.git"
APPS=(
  'coin-game,coinGameWorkshops,coinGame,3000'
  'coin-game-new,coinGameNewWorkshops,coinGameNew,3035'
  'coin-game-guardian,coinGameGuardianWorkshops,coinGameGuardian,3024,Coin Game'
  'coin-game-dex,coinGameDexWorkshops,coinGameDex,3050,Coin Game'
  'coin-game-ratesetter,coinGameRatesetterWorkshops,coinGameRatesetter,3056,Coin Game'
  'coin-game-eagile,coinGameEverydayAgileWorkshops,coinGameEverydayAgile,3064,Coin Game'
)

for ((i = 0; i < ${#APPS[@]}; i++))
do
  REC="${APPS[$i]}"

  APP=`echo $REC | cut -d, -f1`
  WORKSHOPCOLLECTION=`echo $REC | cut -d, -f2`
  GAMECOLLECTION=`echo $REC | cut -d, -f3`
  PORT=`echo $REC | cut -d, -f4`
  APPNAME=`echo $REC | cut -d, -f5`

  echo "------------------------------------------------"
  if [ -z "$APPNAME" ]; then
    echo "Installing $APP ($WORKSHOPCOLLECTION, $GAMECOLLECTION, $PORT)"
  else
    echo "Installing $APP ($WORKSHOPCOLLECTION, $GAMECOLLECTION, $PORT, $APPNAME)"
  fi
  echo "------------------------------------------------"

  DIR="/usr/apps/$APP"
  if [ ! -d $DIR ]; then
    git clone $REPO $DIR
  fi
  ENVFILE="$DIR/.env"
  echo "VUE_APP_PORT=$PORT" > $ENVFILE
  echo "VUE_APP_WORKSHOP_COLLECTION=$WORKSHOPCOLLECTION" >> $ENVFILE
  echo "VUE_APP_GAME_COLLECTION=$GAMECOLLECTION" >> $ENVFILE
  if [ ! -z "$APPNAME" ]; then
    echo "VUE_APP_NAME=$APPNAME" >> $ENVFILE
  fi

  cd $DIR

  PWD=`pwd`
  APP=`basename $PWD`
  git stash
  GIT=`git pull`
  echo $GIT
  if [ "$FORCE" != "true" -a "$GIT" == "Already up to date." ]; then
    exit 0
  fi

  npm install
  npm run build
  if [ ! -d /var/www/html/$APP/ ]; then
    mkdir /var/www/html/$APP
  fi
  if [ -d /var/www/html/$APP/css ]; then
    rm /var/www/html/$APP/css/*
  else
    mkdir /var/www/html/$APP/css
  fi
  if [ -d /var/www/html/$APP/js ]; then
    rm /var/www/html/$APP/js/*
  else
    mkdir /var/www/html/$APP/js
  fi
  cp -R dist/* /var/www/html/$APP
  if [ -f "src/server.js" ]; then
    SERVER=`ps -ef | grep server.js | grep "/$APP/" | awk {'print $2'}`
    if [ "$SERVER" != "" ]; then
      kill -9 $SERVER
    fi
  fi

done

ps -ef | grep php | grep outdated
if [ $? -eq 1 ]; then
  php /usr/apps/monitor/src/lib/outdated.php &
fi
