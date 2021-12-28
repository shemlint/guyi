const WebSocket=require('ws')
const fs=require('fs')
const path=require('path')

const ws = new WebSocket('ws:/localhost:8080')
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
ws.on('error',(e)=>{
    console.log(e)
})
