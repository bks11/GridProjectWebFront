import { genNewDataForGrid } from './dataproc.js'

let commonData
let gridParams

const setInitData = () =>  
{
    commonData = genNewDataForGrid()
    gridParams = Object.keys(commonData)
    return gridParams
}

const getGridsParams = () => gridParams 

const getDataByPosition = position => commonData[position]

const moveRow = ({ id, from, to }) => 
{
    const idx = commonData[from].findIndex(d => d.id === id)
    let aim = getDataByPosition(to)
    const rec = commonData[from].splice(idx, 1)
    aim.push(rec[0])        
}

export { setInitData, getDataByPosition, moveRow, getGridsParams }      