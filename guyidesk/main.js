try {
    const path = require('path')
    const electron = require('electron')
    const { app, BrowserWindow, ipcMain } = electron
    const loudness = require('loudness')
    const brightness = require('brightness')
    const fs = require('fs')
    const os = require('os')
    const nativeImage = electron.nativeImage
    const screenshot = require('screenshot-desktop')
    const Conf = require('conf')
    const robot = require('robotjs')
    const say = require('say')
    const express = require('express')
    const fileUpload = require('express-fileupload')
    const ws = require('ws')
    const jimp = require('jimp')
    const pngToIco = require('png-to-ico')

    const config = new Conf()

    /**@type {BrowserWindow} */
    let winRef;
    const ipc = ipcMain

    //#region ipc events
    ipcMain.on('log', (event, args) => {
        console.log(event, args)
        event.returnValue = 'got data'

    })
    ipcMain.on('setvolume', async (event, data) => {
        try {
            await loudness.setVolume(data)
            event.returnValue = true

        } catch (err) {
            event.returnValue = null
        }

    })
    ipcMain.on('getvolume', async (event) => {
        try {
            let vol = await loudness.getVolume()
            event.returnValue = vol
        } catch (err) {
            event.returnValue = null
        }

    })
    ipcMain.on('setmuted', async (event, val) => {
        try {
            await loudness.setMuted(val)
            event.returnValue = true
        } catch (err) {
            event.returnValue = null
        }
    })
    ipcMain.on('getmuted', async (event) => {
        try {
            let m = await loudness.getMuted()
            event.returnValue = m
        } catch (err) {
            event.returnValue = null
        }
    })
    ipc.on('maximize', (event) => {
        try {
            winRef.maximize()
            event.returnValue = true
        } catch (err) {
            event.returnValue = null
        }
    })
    ipc.on('minimize', (event) => {
        try {
            winRef.minimize()
            event.returnValue = true
        } catch (err) {
            event.returnValue = null
        }
    })
    ipc.on('setsize', (event, w, h) => {
        try {
            winRef.setSize(w, h)
            event.returnValue = true
        } catch (err) {
            event.returnValue = null
        }
    })
    ipc.on('setbrightness', async (event, val) => {
        try {
            await brightness.set(val)
            event.returnValue = true
        } catch (err) {
            event.returnValue = null
        }
    })
    ipc.on('getbrightness', async (event) => {
        try {
            let b = await brightness.get()
            event.returnValue = b
        } catch (err) {
            event.returnValue = null
        }
    })
    ipc.on('setposition', (event, x, y) => {
        try {
            winRef.setPosition(x, y)
            event.returnValue = true
        } catch (err) {
            event.returnValue = null
        }
    })
    ipc.on('setmaxsize', (event, w, h) => {
        try {
            winRef.setMaximunSize(w, h)
            event.returnValue = true
        } catch (err) {
            event.returnValue = null
        }
    })
    ipc.on('setminsize', (event, w, h) => {
        try {
            winRef.setMinimumSize(w, h)
            event.returnValue = true
        } catch (err) {
            event.returnValue = null
        }
    })
    ipc.on('setmovable', (e, val) => {
        try {
            winRef.setMovable(val)
            e.returnValue = true
        } catch (err) {
            e.returnValue = null
        }
    })

    ipc.on('setfullscreen', (e, val) => {
        try {
            winRef.setFullScreen(val)
            e.returnValue = true
        } catch (err) {
            e.returnValue = null
        }
    })
    ipc.on('isfullscreen', (e) => {
        try {
            let f = winRef.isFullScreen()
            e.returnValue = f
        } catch (err) {
            e.returnValue = null
        }
    })
    ipc.on('setprogress', (e, val) => {
        try {
            winRef.setProgressBar(val)
            e.returnValue = true
        } catch (err) {
            e.returnValue = null
        }
    })
    ipc.on('seticon', (e, val) => {
        try {

            let img = nativeImage.createFromDataURL(val)
            winRef.setIcon(img)
            e.returnValue = true

        } catch (err) {
            e.returnValue = null
        }
    })
    ipc.on('setoverlayicon', (e, val, desc) => {
        try {

            let img = nativeImage.createFromDataURL(val)
            winRef.setOverlayIcon(img, desc)
            e.returnValue = true

        } catch (err) {
            e.returnValue = null
        }
    })
    ipc.on('screenshot', async (e) => {
        try {
            let img = await screenshot()
            let b64 = img.toString('base64')
            e.returnValue = b64
        } catch (err) {
            e.returnValue = null
            console.log(e)
        }
    })
    ipc.on('screenshotall', async (e) => {
        try {
            let imgs = await screenshot.all()
            let b64s = []
            imgs.forEach(img => b64s.push(img.toString('base64')))
            e.returnValue = b64s
        } catch (err) {
            e.returnValue = null
            console.log(err)

        }
    })
    ipc.on('center', (e) => {
        try {
            winRef.center()
            e.returnValue = true
        } catch (err) {
            e.returnValue = null
        }
    })
    ipc.on('flashframe', (e, val) => {
        try {
            winRef.flashFrame(val)
            e.returnValue = true
        } catch (err) {
            e.returnValue = null
        }
    })
    ipc.on('getinfo', (e) => {
        try {
            let data = {
                argv: process.argv,
                totalmem: os.totalmem(),
                arch: os.arch(),
                cpus: os.cpus(),
                endianness: os.endianness(),
                freemem: os.freemem(),
                homedir: os.homedir(),
                hostname: os.hostname(),
                platform: os.platform(),
                tmpdir: os.tmpdir(),
                type: os.type(),
                userinfo: os.userInfo(),
                uptime: os.uptime(),
                version: os.version(),
                eol: os.EOL,
                devNull: os.devNull,
                signals: os.signals,
                constants: os.constants,
                cpuusage: process.cpuUsage(),
                resourceusage: process.resourceUsage(),
                memoryusage: process.memoryUsage(),
                env: process.env,
                cwd: process.cwd(),
                pid: process.pid,

            }

            let d = JSON.stringify(data)
            e.returnValue = JSON.parse(d)
        } catch (err) {
            console.log(e)
            e.returnValue = {}//data
        }
    })
    ipc.on('setalwaysontop', (e, val, level) => {
        try {
            winRef.setAlwaysOnTop(val, level)
            e.returnValue = true
        } catch (err) {
            e.returnValue = null
        }
    })
    ipc.on('storeapp', (e, app) => {
        try {
            config.set('app', app)
            e.returnValue = true
        } catch (err) {
            e.returnValue = null
        }
    })
    ipc.on('getapp', (e) => {
        try {
            let app = config.get('app')
            e.returnValue = app
        } catch (err) {
            e.returnValue = null
        }
    })
    //#endregion
    ipc.on('openconsole', (e, val) => {
        try {
            if (val) winRef.webContents.openDevTools()
            else winRef.webContents.closeDevTools()
            e.returnValue = true
        } catch (err) {
            e.returnValue = null
        }
    })
    ipc.on('evalnode', (e, val) => {
        try {
            // let func = Function('robot', 'say', 'electron', 'express', 'fileUpload', 'ws', `return (function(){${val}})()`)
            // e.returnValue = func(robot, say, electron, express, fileUpload, ws)
            e.returnValue = eval(val)
        } catch (err) {
            e.returnValue = 'error, ' + err.message
        }
    })

    ipc.on('pinshortcut', (e, id, name, iconData) => {
        createShortcut(id, name, iconData)
        e.returnValue = true

    })

    async function createShortcut(id, name, iconData) {
        try {
            const createDesktopShortcut = require('create-desktop-shortcuts')
            let parts = iconData.split(","), ext = parts[0].match(/:image\/([^;]*);/)[1],
                data = parts[1]
            let guyiTmp = path.join(os.tmpdir(), 'guyi')
            if (!fs.existsSync(guyiTmp)) {
                fs.mkdirSync(guyiTmp, { recursive: true })
            }
            let tmpPath = path.join(guyiTmp, "tmpfile." + ext)
            let iconPath = path.join(guyiTmp, `icon${Math.random()}.`)
            fs.writeFileSync(tmpPath, data, 'base64')
            let img = await jimp.read(tmpPath)
            img.resize(100, 100)
            img.write(iconPath + "png", () => {
                img.write(iconPath + "jpg", async () => {
                    let icoImg = await pngToIco(iconPath + 'png')
                    fs.writeFileSync(iconPath + 'ico', icoImg)
                    let filePath = process.argv[0]
                    console.log('creating shortcut', ext)
                    let args = `startapp,${name.replaceAll(" ", "20%")}`
                    const shortcutsCreated = createDesktopShortcut({
                        customLogger: (mes, err) => {
                            console.log(mes, err)
                        },
                        windows: {
                            filePath,
                            name,
                            comment: `Guyi's app ${name}`,
                            icon: iconPath + 'ico',
                            arguments: args,
                        },
                        linux: {
                            filePath,
                            name,
                            description: `Guyi's ${name}`,
                            icon: iconPath + 'png',
                            arguments: args,
                        },
                        osx: {
                            filePath,
                            name,
                        }
                    })
                    return shortcutsCreated
                })
            })

        } catch (e) {
            console.log('error', e)
            return e.message
        }

    }
    const createWindow = () => {
        let win = new BrowserWindow({
            width: 680,
            height: 400,
            title: 'Guyi Desktop(0.9.3)',
            icon: path.join(__dirname, "icons/appicon.png"),
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
        winRef = win
        win.loadFile('guyi.html')
        win.removeMenu()
       // win.webContents.openDevTools()
    }
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })
    app.on('activate', () => {
        createWindow()
    })

    app.whenReady().then(() => {
        createWindow()
    })

} catch (e) {
    console.log('Guyi desktop crushed', e)
}