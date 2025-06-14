import dgram from 'node:dgram';
import url from 'node:url';
import crypto from 'node:crypto';
import torrentParser from 'torrent-parser';
import buffer from 'node:buffer'
import { genId } from './utils';

export const getPeers=(torrent,callback)=>{
    const socket=dgram.createSocket('udp4');
    const urlData=url.parse(torrent.announce.toString('utf8'));

    urlSend(socket,buildConnectReq(),urlData);

    socket.on('message',(response)=>{
        if(resType(response)==='connect'){
            const connRes=parseConnRes(response);
            const announceReq=buildAnnounceReq(connRes.connection_id);
            urlSend.send(socket,announceReq,urlData);
        }else{
            const announceRes=parseAnnounceRes(response);
            callback(announceRes.peers);
        }
    })
}

function urlSend(socket,msg,url){
    socket.send(msg,0,msg.length,url.port,url.host,()=>{})
}

function resType(res){

}

function  buildAnnounceReq(connId,torrent,port=6881){
    const buf=buffer.Buffer.alloc(98);
    connId.copy(buf,0);
    buf.writeUInt32BE(1,8);
    crypto.randomBytes(4).copy(buf,12);
    torrentParser.infoHash(torrent).copy(buf,16);
    genId().copy(buf,36);
    buffer.Buffer.alloc(8).copy(buf,56);
    torrentParser.size(torrent).copy(buf,64);
    buffer.Buffer.alloc(8).copy(buf,72);
    buf.writeUInt32BE(0,80);
    buf.writeUInt32BE(0,84);
    crypto.randomBytes(4).copy(buf,88);
    buf.writeUInt32BE(-1,92);
    buf.writeUInt16BE(port,96);

    return buf;
}

function buildConnectReq(){
    const buf=buffer.Buffer.alloc(16);
    buf.writeUInt32BE(0x417,0);
    buf.writeUInt32BE(0x27101980,4);
    buf.writeUInt32BE(0,8);
    crypto.randomBytes(4).copy(buf,12);

    return buf;
}

function parseConnRes(res){
    return{
        action:res.readUInt32BE(0),
        transaction_id:res.readUInt32BE(4),
        connection_id:res.slice(8)
    }
}

function parseAnnounceRes(){}

