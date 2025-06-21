import buffer from 'node:buffer';
import { infoHash } from './torrent-parser';
import { genId } from './utils';

export const buildHandShake=(torrent)=>{
    
    const buf=buffer.Buffer.alloc(68);
    buf.writeUInt8(19,0);
    buf.write('BitTorrent protocol',1);
    buf.writeUInt32BE(0,20);
    buf.writeUInt32BE(0,24);
    infoHash(torrent).copy(buf,28);
    buf.write(genId());

    return buf;

}

export const buildKeepAlive=()=>buffer.Buffer.alloc(4);


export const buildChoke=()=>{
    const buf=buffer.Buffer.alloc(5);
    buf.writeUInt32BE(1,0);
    buf.writeUInt8(0,4);

    return buf;
}

export const buildUnChoke=()=>{
    const buf=buffer.Buffer.alloc(5);
    buf.writeUInt32BE(1,0);
    buf.writeUInt8(1,4);

    return buf;
}

export const buildInterested=()=>{
    const buf=buffer.Buffer.alloc(5);
    buf.writeUInt32BE(1,0);
    buf.writeUInt8(2,4);

    return buf;
}

export const buildUninterested=()=>{
    const buf=buffer.Buffer.alloc(5);
    buf.writeUInt32BE(1,0);
    buf.writeUInt8(3,4);

    return buf;
}

export const buildHave=(payload)=>{
    const buf=buffer.Buffer.alloc(9);
    buf.writeUInt32BE(5,0);
    buf.writeUInt8(4,4);

    buf.writeUInt32BE(payload,5);

    return buf;
}

export const buildBitfield=(bitfield)=>{
    const buf=buffer.Buffer.alloc(14);

    buf.writeUInt32BE(bitfield.length+1,0);
    buf.writeUInt8(5,4);

    bitfield.copy(buf,5);

    return buf;
}

export const buildRequest=(payload)=>{
    const buf=buffer.Buffer.alloc(17);

    buf.writeUInt32BE(13,0);

    buf.writeUInt8(6,4);
    buf.writeUInt32BE(payload.index,5);
    buf.writeUInt32BE(payload.begin,9);
    buf.writeUInt32BE(payload.length,13);

    return buf;
}

export const buildPiece=(payload)=>{
    const buf=buffer.Buffer.alloc(payload.block.length+13);
    buf.writeUInt32BE(payload.block.length+9,0);
    buf.writeUInt8(7,4);
    buf.writeUInt32BE(payload.index,5);
    buf.writeUInt32BE(payload.begin,9);
    payload.block.copy(buf,13);

    return buf;
}

export const buildCancel=(payload)=>{
    const buf=buffer.Buffer.alloc(17);

    buf.writeUInt32BE(13,0);
    buf.writeUInt8(8,4);
    buf.writeUInt32BE(payload.index,5);
    buf.writeUInt32BE(payload.begin,9);
    buf.writeUInt32BE(payload.length,13);

    return buf;
}


export const buildPort=(payload)=>{
    const buf=buffer.Buffer.alloc(7);

    buf.writeUInt32BE(3,0);
    buf.writeUInt8(9,4);
s
    buf.writeUInt32BE(payload,5);

    return buf;
}


export const msgParse=(buf)=>{
    let id=buf.length>4?buf.readUInt8(4):null;
    let payload=buf.length>5?buf.slice(5):null;

    if(id===6 || id===7 || id===8){
        const res=payload.slice(8);
        const payload={
            index:payload.readUInt32BE(0),
            begin:payload.readUInt32BE(4),
        }
        payload[id===7?'block':'length']=res;
    }

    return{
        size:buf.readUInt32BE(0),
        id:id,
        payload:payload
    }
}