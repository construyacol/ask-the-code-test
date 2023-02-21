const fs = require('fs');
const bgr = require('build-gradle-reader');
const convert = require('xml-js');
const androidGradle = fs.readFileSync(__dirname + "/../android/app/build.gradle", "utf8");
const iosPlist = fs.readFileSync(__dirname + "/../ios/App/App/Info.plist", "utf8");
const androidJson = bgr(androidGradle);
const iosJson = convert.xml2js(iosPlist, {compact: true, spaces: 4});
const versionIndex = iosJson.plist.dict.key.findIndex(k => k._text === 'CFBundleShortVersionString');
const iosVersion =iosJson.plist.dict.string[versionIndex]._text;
const androidVersionCode = androidJson.android.defaultConfig.versionCode;
const versionJson = {
    androidVersionCode,
    iosVersion
}
fs.writeFileSync('public/version.js', `(() => window.appVersion = ${JSON.stringify(versionJson)})()`);
