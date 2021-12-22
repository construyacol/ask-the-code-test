const FileSystem = require('pwd-fs');
const pfs = new FileSystem();

const deleteModels = async() => {
    const access = await pfs.test('./public/models');
    if(access){
        try {
           await pfs.remove('./public/models');
           console.log('<============ FACE API Local tensor models has been DELETED ============>') 
        } catch (error) {
           console.log('<============ Error deleting models ============>')
        }
    }else{
        console.log('<============ There are no models to Delete ============> ')
    }
}

deleteModels()