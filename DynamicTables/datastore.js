import { genNewDataForGrid } from './dataproc.js'

let commonData
let gridParams

const getInitData = () =>  commonData = genNewDataForGrid()

const getGridsParams = () => gridParams = Object.keys(commonData)

const getDataByPosition = position => commonData[position]

const moveRow = ({ id, from, to }) => 
{
    const idx = commonData[from].findIndex(d => d.id === id)
    let aim = getDataByPosition(to)
    const rec = commonData[from].splice(idx, 1)
    aim.push(rec[0])        
}

export { getInitData, getDataByPosition, moveRow, getGridsParams }      