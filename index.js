import { open } from './src/torrent-parser.js';
import { getPeers } from './src/tracker.js';

const torrent=open(process.args[2]);

console.log(torrent);

getPeers(torrent,(peer)=>{
    console.log('list of peers',peer);
})

console.log("hello world")



