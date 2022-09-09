const FileSystem = require('pwd-fs');
const pfs = new FileSystem();

const copyAssets = async() => {
        try {
            console.log('<============ Copying CDN Assets ============>')
            await pfs.copy('./cdn', './build');
         } catch (error) {
            console.log('<============ Error Copying CDN Assets ============>')
         }
}

copyAssets()