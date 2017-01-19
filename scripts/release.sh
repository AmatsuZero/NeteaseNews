#!/usr/bin/env bash
npm install

react-native bundle --dev false --platform ios \
    --bundle-output "/tmp/main.jsbundle" --entry-file index.ios.js

xctool -project ios/news.xcodeproj -scheme news build -sdk iphoneos \
    configuration Release OBJROOT=$PWD/build SYMROOT=$PWD/build

if [[ $? != 0 ]];then
     echo ">> build failed"
     exit 1;
 fi

PROVISIONING_PROFILE="$HOME/Library/MobileDevice/Provisioning Profiles/MyAppdev.mobileprovision"
OUTPUTDIR="$PWD/build/Release-iphoneos"
NAME=Esports_${TRAVIS_COMMIT:0:6}.ipa

xcrun -log -sdk iphoneos PackageApplication "$OUTPUTDIR/MyApp.app" \
    -o "$OUTPUTDIR/$NAME"

if [[ $? != 0 ]];then
     echo ">> package application failed"
     exit 1;
 fi

cd $OUTPUTDIR
curl --ftp-create-dirs -T "$NAME" -u $FTP_USER:$FTP_PASSWORD \
    ftp://$FTP_SERVER/esports/$NAME

echo ">> {$NAME} uploaded!"
echo ">> all done!"