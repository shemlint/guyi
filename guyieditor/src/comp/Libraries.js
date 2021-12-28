import React from 'react'
import IconWrapper from './IconWrapper'
import Widgets from './Widgets'
import { Preview } from './Resources'

const Libraries = () => {
    return (
        <div>
            <Widgets />
            <IconWrapper />
            <Files />
        </div>

    )
}

export default Libraries


const FilePrev = ({ file }) => {
    if (!(file.type.includes('image') || file.type.includes('video'))) {
        return <div></div>
    }
    return (
        <div style={{ margin: 1 }} draggable={true} onDragStart={(e) => {
            e.dataTransfer.setData('text', `res://${file.name}`)
        }} >
            <Preview file={file} size={50} />
        </div>
    )
}

const Files = () => {
    let files = global.files.filter(f => !f.by || !f.by.startsWith('module'))
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {files.map(f => <FilePrev key={f.name} file={f} />)}
        </div>
    )

}