import fs from 'fs';
import bencode from 'bencode';
import url from 'node:url';
import dgram from 'node:dgram';
import buffer from 'node:buffer';

const torrent=bencode.decode(fs.readFileSync('assets/puppy.torrent'),'utf8');

const Url=url.parse(torrent.announce.toString('utf8'));
console.log(Url);

const socket =dgram.createSocket('udp4');

const msg=buffer.Buffer.from('Hello?','utf8');

socket.send(msg,0,msg.length,Url.port,Url.host,()=>{});

socket.on('message',msg=>{console.log(msg)})



