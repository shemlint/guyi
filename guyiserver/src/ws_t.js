const  {WebSocket, WebSocketServer } =require('ws')
const fs=require('fs')
const path=require('path')

const wss = new WebSocketServer({ port: 8080 })
wss.on('connection', (ws, req) => {
    console.log('Connection', req.socket.remoteAddress)
    ws.on('message', (mes) => {
        console.log('Received : ', mes)
        setTimeout(()=>ws.send('Got message '+mes),1000)
    })
    ws.send('Hello client')
})
//console.log('wss', wss)

const ws = new WebSocket('ws://localhost:8080')
ws.on('open', () => {
    ws.send('Gratings from client')
})
let no=0
ws.on('message', (mes) => {
    if(Buffer.isBuffer(mes)){
        console.log('found buffer')
        fs.writeFileSync(path.join(process.cwd(),(no++)+'downs.jpg'),mes)
        console.log('recieved from server :s', mes.toString('utf8').slice(0,100))
    }
})
ws.on('close',()=>{
    console.log('client connection close')
})

