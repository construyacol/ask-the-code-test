const FileSystem = require('pwd-fs');
const pfs = new FileSystem();

const copyModels = async() => {
    const access = await pfs.test('./public/models');
    if(!access){
        try {
            console.log('<============ FACE API tensor models copied from CDN to LOCAL environment ============>')
            await pfs.copy('./cdn/tensor/models', './public');
         } catch (error) {
            console.log('<============ Error copying models ============>')
         }
    }else{
        console.log('<============ Tensor models has been copied ============>')
    }
}

copyModels()