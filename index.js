import { open } from './torrent-parser.js';
import { getPeers } from './tracker.js';

const torrent=open('assets/puppy.torrent');

// const Url=url.parse(torrent.announce.toString('utf8'));
// console.log(Url);

// const socket =dgram.createSocket('udp4');

// const msg=buffer.Buffer.from('Hello?','utf8');

// console.log(msg);

// socket.send(msg,0,msg.length,Url.port,Url.host,()=>{});

// socket.on('message',msg=>{console.log(msg)})

getPeers(torrent,(peer)=>{
    console.log('list of peers',peer);
})



