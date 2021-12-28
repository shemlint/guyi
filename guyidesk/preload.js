const { ipcRenderer, contextBridge } = require('electron')
const fs = require('fs')


window.process = {}
window.Win32 = "electron"
window.addEventListener('message',(e)=>{
    console.log('got data ',e.data)
})


let waitingMessages = []
let appLoaded = false
const sendMessage = (mes) => {
    if (appLoaded) {
        window.postMessage(mes)
    } else {
        waitingMessages.push(mes)
    }
}


function send(mes, data, data2, data3) {
    let res = ipcRenderer.sendSync(mes, data, data2, data3)
    return res
}

const pageLoaded = () => {
    appLoaded = true
    waitingMessages.forEach(m => sendMessage(m))
    waitingMessages = []
    let args = Win32.evalNode('process.argv') //process.argv
    let appName = args.filter(a => a.startsWith('startapp,'))
    if (appName[0]) {
        let name=appName[0].replaceAll("20%"," ")
        sendMessage(`${name}`) //startapp,name
    }else{
        console.info('Not a shortcut',eval('process.argv'),args)
    }
    console.log('app starting ',args)
}
const dirFilesExists = () => {
    if (!(fs.existsSync('files') && fs.lstatSync('files').isDirectory())) {
        fs.mkdirSync('files')

    }
}

const Desk = {
    //#region
    maximize() {
        return send('maximize')
    },
    minimize() {
        return send('minimize')
    },
    setSize(w, h) {
        return send('setsize', w, h)
    },
    setBrightness(val) {
        return send('setbrightness', val)
    },
    getBrightness() {
        return send('getbrightness')
    },
    setVolume(val) {
        return send('setvolume', val)
    },
    getVolume() {
        return send('getvolume')
    },
    setMuted(val) {
        return send('setmuted', val)
    },
    getMuted() {
        return send('getmuted')
    },
    setMaxSize(w, h) {
        return send('setmaxsize', w, h)
    },
    setMinSize(w, h) {
        return send('setminsize', w, h)
    },
    setMovable(val) {
        return send('setmovable', val)
    },
    setPosition(x, y) {
        return send('setposition', x, y)
    },
    // setOpacity(val) {
    //     return send('setopacity', val)
    // },
    setFullScreen(val) {
        return send('setfullscreen', val)
    },
    isFullScreen() {
        return send('isfullscreen')
    },
    setProgressBar(val) {
        return send('setprogress', val)
    },
    setIcon(val) {
        return send('seticon', val)
    },
    setOverlayIcon(val, desc) {
        return send('setoverlayicon', val, desc)
    },
    screenshot() {
        return send('screenshot')
    },
    screenshotAll() {
        return send('screenshotall')
    },
    center() {
        return send('center')
    },
    flashFrame(val) {
        return send('flashframe', val)
    },
    getInfo() {
        return send('getinfo')
    },
    setAlwaysOnTop(val, level) {
        return send('setalwaysontop', val, level)
    },
    //#endregion
    readFile(name, text = false) {
        try {
            dirFilesExists()
            if (!fs.existsSync(name)) {
                return null
            }
            let data = fs.readFileSync(name, { encoding: text ? 'utf8' : 'base64' })
            return Buffer.isBuffer(data) ? data.toString('base64') : data


        } catch (e) {
            return null
        }
    },
    writeFile(name, data) {
        try {
            dirFilesExists()

            fs.writeFileSync(name, data)
            return true

        } catch (e) {
            return null
        }
    },
    deleteFile(name) {
        try {
            dirFilesExists()
            if (fs.existsSync(name)) {
                fs.unlinkSync(name)
                return true
            }
            else {
                return false
            }
        } catch (e) {
            return null
        }
    },
    getFiles(name = 'files/') {
        try {
            dirFilesExists()
            if (!fs.existsSync(name)) return false
            let files = fs.readdirSync(name)
            return files

        } catch (e) {
            return null
        }
    },
    sendMessage(mes) {
        window.postMessage(mes)
    },
    deleteDir(name, recursive = false) {
        try {
            dirFilesExists()
            if (!fs.existsSync(name)) return false
            fs.rmdirSync(name, { recursive })
        } catch (e) {
            return null
        }
    },
    exists(name) {
        try {
            dirFilesExists()
            return fs.existsSync(name)
        } catch (e) {
            return null
        }
    },
    isFile(name) {
        try {
            dirFilesExists()
            if (!fs.existsSync(name)) return null
            return fs.lstatSync(name).isFile()
        } catch (e) {
            return null
        }
    },
    isDirectory(name) {
        try {
            dirFilesExists()
            if (!fs.existsSync(name)) return null
            return fs.lstatSync(name).isDirectory()

        } catch (e) {
            return null
        }
    },
    stats(name) {
        try {
            if (!fs.existsSync(name)) return false
            return JSON.parse(JSON.stringify(fs.lstatSync(name)))

        } catch (e) {
            console.log(e.message)
            return null
        }

    },
    mkDir(name, mode, recursive) {
        try {
            fs.mkdirSync(name, mode, recursive)
            return true

        } catch (e) {
            return null
        }

    },
    copyFile(name, dest) {
        try {
            fs.copyFileSync(name, dest)
            return true

        } catch (e) {
            return null
        }
    },
    storeApp(app) {
        return send('storeapp', app)
    },
    getApp() {
        return send('getapp')
    },
    openConsole(val) {
        return send('openconsole', val)
    },
    evalNode(file) {                    //depended on by pageload
        return send('evalnode', file)
    },
    pinShortcut(id, name, icon) {
        return send('pinshortcut', id, name, icon)
    },
    appLoadDone() {
        pageLoaded()
        return true
    }
}

contextBridge.exposeInMainWorld('Desk', Desk)
contextBridge.exposeInMainWorld('guyi_os',process.platform)

window.addEventListener('DOMContentLoaded', () => {
    // sendMessage('Loading done !!!')

})

