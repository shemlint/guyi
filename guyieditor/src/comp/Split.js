import React, { useState } from 'react'
import { Resizable } from 'react-resizable'
const Split = () => {
    const size = useState({ x: 100, y: 50 })
    const resize = (e, { el, sz, hand }) => {
        console.log(e, el, sz, hand)
    }
    return (
        <div style={{ position: 'relative' }} >
            <Resizable width={size.x} height={size.y} onResize={resize} >
                <>
                    <div>One is not for the fait hearted</div>
                    <div>The boy is back</div>
                </>
            </Resizable>
        </div>
    )
}

export default Split
