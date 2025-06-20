import bencode from 'bencode';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { toBufferBE } from 'bigint-buffer';

export const open=(filePath)=>{
    return bencode.decode(fs.readFileSync(filePath),'utf8')
}

export const size=(torrent)=>{
    let size=0;
    if(torrent.info.files){
        torrent.info.files.map(torr=>{
            size+=torr.length
        })
    }else{
        size=torrent.info.length;
    }

    return toBufferBE(size,8);
}

export const infoHash=(torrent)=>{
    const info=bencode.encode(torrent.info);
    return crypto.createHash('sha1').update(info).digest();
}

