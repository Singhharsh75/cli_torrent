import { getPeers } from "./tracker"
import net from 'node:net';
import buffer from 'node:buffer';
import { buildHandShake, buildInterested, msgParse } from "./message";

export const exp=(torrent)=>{
    getPeers(torrent,(peer)=>{
        peer.forEach(pe=>download(pe,torrent));
    })
}

function download(peer,torrent){
    const socket=net.Socket();

    
    socket.on('error',console.log);
    socket.connect(peer.port,peer.ip,()=>{
        socket.write(buildHandShake(torrent))
    })

    onWhileMsg(socket,msg=>{
        msgHandler(msg,socket);
    })
}

function msgHandler(msg,socket){
    if(!isHandShakeMsg(msg)){
        socket.write(buildInterested())
    }else{
        const message=msgParse(msg);
        if(message.id===0)chokeHandler();
        if(message.id===1)unChokeHandler();
        if(message.id === 4) haveHandler(m.payload);
        if(message.id === 5) bitfieldHandler(m.payload);
        if(message.id === 7) pieceHandler(m.payload);
    }
}

function isHandShakeMsg(msg){
    return msg.length===msg.readUInt8(0)+49 && msg.toString('utf8',1)==='BitTorrent protocol';
}

function onWhileMsg(socket,callback){
    let savedBuf=buffer.Buffer.alloc(0);
    let handShake=true;

    socket.on('data',recievedBuf=>{
        const msgLen=()=>handShake?savedBuf.readUInt8(0)+49:savedBuf.readUInt32BE(0)+4;
        savedBuf=buffer.Buffer.concat([savedBuf,recievedBuf]);

        while(savedBuf.length>=4 && savedBuf.length>=msgLen()){
            handShake=false;
            callback(savedBuf.slice(0,msgLen()));
            savedBuf=savedBuf.slice(msgLen());
        }
    })
}