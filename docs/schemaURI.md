# Implementing Custom URI Schemes with Capacitor on Android and iOS

##  1. Configuration in capacitor.config.json:
In your capacitor.config.json, ensure the following configurations are set:

    -   json
    - Copy code
    - {
    -   "appId": "com.example.app",
    -   "appName": "myApp",
    -   "bundledWebRuntime": false,
    -   "npmClient": "npm",
    -   "webDir": "www",
    -   "server": {
    -     "androidScheme": "myscheme",
    -     "iosScheme": "myscheme"
    -   }
    - }
    - Note: Here, "myscheme" represents the desired URI scheme for your app.

##  2. Android Configuration in AndroidManifest.xml:
Within your main activity (typically MainActivity), integrate this intent-filter:

    - xml
    - Copy code
    - <intent-filter>
    -     <action android:name="android.intent.action.VIEW" />
    -     <category android:name="android.intent.category.DEFAULT" />
    -     <category android:name="android.intent.category.BROWSABLE" />
    -     <data android:scheme="myscheme" />
    - </intent-filter>

This configuration will enable your application to be initiated by external components, such as browsers, when encountering links that utilize the "myscheme" scheme.

##  3. iOS Configuration in Info.plist:
Incorporate the following segment into the Info.plist inside the <dict> tag:

    - xml
    - Copy code
    - <key>CFBundleURLTypes</key>
    - <array>
    -     <dict>
    -         <key>CFBundleTypeRole</key>
    -         <string>Editor</string>
    -         <key>CFBundleURLName</key>
    -         <string>com.example.app</string>
    -         <key>CFBundleURLSchemes</key>
    -         <array>
    -             <string>myscheme</string>
    -         </array>
    -     </dict>
    - </array>

On iOS, this action registers the "myscheme" URI scheme for your app, allowing links with that particular scheme to initiate your app.

Important Notes:
After updating capacitor.config.json, synchronize your Capacitor settings by executing: npx cap sync.

Always test on actual devices to verify proper functionality. Emulators or simulators might occasionally differ in behavior from physical devices.

Ensure your URI scheme is unique to evade potential conflicts with other applications.

Following this guide should empower you to open your app via links using the custom URI scheme on both Android and iOS platforms.