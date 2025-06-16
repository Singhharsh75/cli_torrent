import crypto from 'node:crypto';
import buffer from 'node:buffer'

export const genId=()=>{
    let id=null;
    if(!id){
        id=crypto.randomBytes(20);
        buffer.Buffer.from('-HS0001-').copy(id,0);
    }

    return id;
}