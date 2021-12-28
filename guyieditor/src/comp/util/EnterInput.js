import React from 'react'

const EnterInput = (props) => {
    let localProps={...props}
   delete localProps['onEnter']
     let onEnter = props.onEnter

    const keyDown = (e) => {
        if (e.key === 'Enter'&&typeof onEnter==='function') {
            onEnter(e)
        }
    }
    return (
        <input {...localProps} onKeyDown={keyDown} />
    )
}

export default EnterInput
