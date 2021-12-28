import React, { useState } from 'react'
import { Resizable } from 're-resizable'
import { Scrollbars } from 'react-custom-scrollbars'

import Tooltip from '@material-ui/core/Tooltip'

let localSize = { width: 300, height: 400 }
let localScroll = false

const Screen = ({ children }) => {
    const [size, setSize] = useState(localSize)
    const [scroll, setScroll] = useState(localScroll)
    const resize = (e, dirc, ref, d) => {
        let newSize = { width: size.width + d.width, height: size.height + d.height }
        localSize = newSize
        setSize(newSize)

    }
    const changeScroll = (val) => {
        localScroll = val
        setScroll(val)

    }

    return (
        <div style={{
            width: '100%', height: '100%', display: 'flex', position: 'relative',
            justifyContent: 'center', alignItems: 'center',

        }}>
            <Tooltip title='Clip To work space' >
                <input style={{ position: 'absolute', top: 3, right: 3, zIndex: 100 }}
                    type='checkbox' value={scroll} onChange={(e) => changeScroll(e.target.checked)}
                />
            </Tooltip>
            <Resizable
                size={size}
                style={{ padding: 5, border: '1px dashed blue', }}
                onResizeStop={resize}
            >
                {scroll &&
                    <Scrollbars style={{ width: '100%', height: '100%' }} >
                        {children}
                    </Scrollbars>}
                {!scroll && children}
            </Resizable>
        </div>
    )
}

export default Screen
