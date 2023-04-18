# Coinsenda PWA

This app is built using React Js and Redux, it can be ran on web and mobile apps using [Capacitor](https://capacitorjs.com/)


## Available Scripts

### `yarn start`
Runs the app in the development mode.<br>
Open [http://localhost:2998](http://localhost:2998) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.
 
### `yarn build:mobile`
Build the production bundle

## Mobile local setup using Capacitor

To start testing in mobile you'll need to sync first all the dependencies with 

### `npx cap sync`

Then you can run the app in a simulator/emulator or an android real device

### `npx cap run ios`
### `npx cap run android`

If you want to do changes in the native project, you'll need to open the project in Android Studio or Xcode using:

### `npx cap open ios`
### `npx cap open android`


## Remember the instructions to prepare the environments for Android and iOS:

### Android:

	- Install Java
	- Install Android Studio
	- Set de ANDROID_STUDIO variable in the path

### iOS:

	- Install Xcode
	- Install homebrew and xcode tools in case you need

You'll find a detailed explanation here: https://capacitorjs.com/docs/getting-started/environment-setup

## Local development

For local development you'll need to run the dev server in the root of the repo, remember to install the dependencies first, then, you will need to update the `capacitor.config.json` in order to listen the server changes and the local app you're running.

The IP used in the config is the local one set by the network.

    "server":  {  "url":  "http://192.168.1.68:8100",  "cleartext":  true  },
	
	* new schema:

	"server": {
    	"hostname": "bitsenda.com",
    	"androidScheme": "https",
    	"url": "http://192.168.10.14:2998"
	}, 


More details here: https://capacitorjs.com/docs/guides/live-reload#using-with-framework-clis


## Production build

Generate a production build is simple, just run `yarn build:mobile` and then sync the resources with `npx cap sync`.

### Android
For each new release version, the `versionCode` needs to be increased by 1, the `versionName` can be updated acordingly to the practices in ther team (`major.minor.patch`). 

The file that contains this config is `frontend/android/app/build.gradle`.

The Android keystore is a unique private key, the passwords and credentials should be backed up properly.

The build should be signed in a release mode in Android Studio

### iOS
For each new release version, the `Build` needs to be increased by 1, the `Version` can be updated acordingly to the practices in ther team (`major.minor.patch`).

This is changed on Xcode under App -> General or in the `frontend/ios/App/App/Info.plist`

The certificates are generated from developer.apple.com.


<!-- Disclaimer -->
the current versión of barcode-scanner-plugin uses the old method of including native Android libraries by using compile() on version before API-ANDROID 32, for build compilation. You can change manually (in Project Structure > Dependencies tab) the field “configuration” of the the dependency barcodescanner to switch from “compile” to “implementation”.
config(icono esquina superior derecha en Android estudio) > Project structure...

for more info: https://forum.ionicframework.com/t/error-when-i-build-with-phonegap-barcodescanner-ionic-native/218337/5

