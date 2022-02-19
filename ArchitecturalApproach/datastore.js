import { genNewDataForGrid } from './dataproc.js'

let commonData

const getInitData = () =>  commonData = genNewDataForGrid()

const getDataByPosition = position => commonData[position]

const moveRow = (id, direction, position) => 
{
    let idx = commonData[position].findIndex(d => d.id === id)
        
        const moveAction = (idx, aimPosition) => 
        {
            let aim = getDataByPosition(aimPosition)
            const rec = commonData[position].splice(idx, 1)
            aim.splice(aim.length, 0, rec[0] )
        }
        
        if(position === 'left' ||  position === 'right') 
        {
            moveAction(idx, 'center')
        } 
        else 
        {
            moveAction(idx, direction)
        }
}

export { getInitData, getDataByPosition, moveRow }
