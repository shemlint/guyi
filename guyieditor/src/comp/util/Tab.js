import React, { useState, useEffect } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'

const scrollData = {}

const Tab = ({ data = [], pos = 0, setPos, id = '', noScroll = [] }) => {
    const [statepos, rawsetPos] = useState(pos);
    let realPos = statepos
    if (setPos) realPos = pos
    useEffect(() => {
        try {
            let tab = tabRef.current
            if(!tab)return //noscrollbars eg tab for monaco
            tab.view.onscroll = () => {
                scrollData[id + realPos] = tab.view.scrollTop
            }
            tab.view.scrollTop = scrollData[id + realPos] || 0
        } catch (e) {
            console.log('tab ref error ', e)
        }
    })

    const ssetPos = (idx) => {
        if (typeof setPos === 'function') {
            setPos(idx)
        } else {
            rawsetPos(idx)
        }
    }

    const Title = ({ title = '', index = 0 }) => {
        let bkcolor = index === realPos ? 'rgb(92, 77, 54)' : 'black';
        return (
            <div onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                ssetPos(index)
            }}
                style={{ color: 'white', fontWeight: 'bold', paddingLeft: 2, paddingRight: 2, backgroundColor: bkcolor, border: '1px solid grey' }}
            >{title}
            </div>
        )
    }
    const tabRef = React.useRef()
    const dontScroll = noScroll.includes(realPos)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Scrollbars style={{ width: '100%', height: 28 }}>
                <div style={{ display: 'flex', width: '100%', backgroundColor: 'grey', marginBottom: 5 }}>
                    {data.map((val, index) =>
                        <Title key={val.title} title={val.title} index={index} />)}
                </div>
            </Scrollbars>
            {!dontScroll && <Scrollbars style={{ width: '100%', flex: 1 }} ref={tabRef}  >
                <div style={{ position: 'relative' }}>
                    {data[realPos].comp}
                </div>
            </Scrollbars>}
            {dontScroll && <div className='tab-noscroll' style={{ position: 'relative', overflow: 'hidden' }} >
                {data[realPos].comp}
            </div>}
        </div>
    )
}

export default Tab