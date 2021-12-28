import React, { useState } from 'react'

const Accordion = ({ data = [], pos = 0 }) => {
    const [statepos, setPos] = useState(pos);
    const Title = ({ title = '', index = 0 }) => {
        let bkcolor = index === statepos ? 'rgb(92, 77, 54)' : 'black';
        return (
            <div onClick={(e) => {
               setPos(index)
            }}
                style={{ color: 'white', fontWeight: 'bold', paddingLeft: 2, paddingRight: 2, backgroundColor: bkcolor, border: '1px solid grey' }}
            >{title}
            </div>
        )
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.map((val, index) => {
                if (index === statepos) {
                    return <div >
                        <Title key={val.title} title={val.title} index={index}/>
                        <div key={val.title+'comp'}>{data[statepos].comp}</div>
                    </div>
                }
                return <Title key={val.title} title={val.title} index={index}/>
            })}
        </div>
    )
}

export default Accordion
