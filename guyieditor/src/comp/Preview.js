import React, { useState } from 'react'
import { Resizable } from 're-resizable'
import { Scrollbars } from 'react-custom-scrollbars'

import Comp from './Comp'

let localSize = { width: 300, height: 400 }

const Preview = ({ mutApp, app, state, setState, setFull }) => {
    const [size, setSize] = useState(localSize)
    const [drag, setDrag] = useState(global.currentDrag)
    const resize = (e, dirc, ref, d) => {
        let newSize = { width: size.width + d.width, height: size.height + d.height }
        localSize = newSize
        setSize(newSize)

    }
    
    let fullView = (
        <div style={{ width: '100%', height: '100vh', backgroundColor: 'white' }}>
            <Scrollbars style={{ width: '100%', height: '100%' }} >
                <Comp tree={mutApp} id={app[1].id} state={state} setState={setState}    />
            </Scrollbars>
        </div>
    )
    return (
        <div style={{
            width: '100%', height: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', backgroundColor: 'black',
        }}>
            <div style={{ position: 'fixed', top: 3, right: 3,zIndex:1000000000 }} >
                <button onClick={() => { let d = !drag; setDrag(d); global.currentDrag = d }}  >{drag ? 'FullScreen' : 'Resizable'} </button>
                <button onClick={() => setFull(false)}  >close  </button>
            </div>
            {drag && <div style={{ position: 'fixed', left: 3, top: 3, color: 'yellow' }}>Resizable({`${localSize.width}X${localSize.height}`})</div>}
            {drag && <Resizable
                size={size}
                onResizeStop={resize}
                style={{ backgroundColor: 'white',}}
            >
                <Scrollbars style={{ width: '100%', height: '100%' }} >
                    <Comp tree={mutApp} id={app[1].id} state={state} setState={setState} />
                </Scrollbars>
            </Resizable>}
            {!drag && fullView}
        </div>
    )
}
export default Preview


