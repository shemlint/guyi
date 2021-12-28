const fs = require('fs')
const jimp = require('jimp')
const pngToIco = require('png-to-ico')
const path = require('path')
const os = require('os')


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
        let iconPath = path.join(guyiTmp, `icon${2020}.`)
        fs.writeFileSync(tmpPath, data, 'base64')
        let img = await jimp.read(tmpPath)
        img.resize(100, 100)
        img.write(iconPath + "png", () => {
            img.write(iconPath + "jpg", async () => {
                let icoImg = await pngToIco(iconPath + 'png')
                fs.writeFileSync(iconPath + 'ico', icoImg)
                let filePath = process.argv[0]
                console.log('creating shortcut', ext)

                const shortcutsCreated = createDesktopShortcut({
                    customLogger: (mes, err) => {
                        console.log(mes, err)
                    },
                    windows: {
                        filePath,
                        name,
                        comment: `Guyi's app ${name}`,
                        icon: iconPath + 'ico',
                        arguments: `startapp,${name.replaceAll(" ", "20%")}`,
                    },
                    linux: {
                        filePath,
                        name,
                        description: `Guyi's ${name}`,
                        icon: iconPath + 'png',
                        arguments: `startapp,${name.replaceAll(" ", "20%")}`,
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




let data = fs.readFileSync("base64.txt", 'utf8')
createShortcut('123', 'Working guyi', data)
console.log('running app')
