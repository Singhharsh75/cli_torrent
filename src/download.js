import { getPeers } from "./tracker"
import net from 'node:net';

export const exp=(torrent)=>{
    getPeers(torrent,(peer)=>{
        peer.forEach(download);
    })
}

function download(peer){
    const socket=net.Socket();
    socket.on('error',console.log);
    socket.connect(peer.port,peer.ip,()=>{

    })

    socket.on('data',(data)=>{
        console.log(data);
    })
}