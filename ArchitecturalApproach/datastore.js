import { genNewDataForGrid } from './dataproc.js'
let commonData

const getInitData = () =>  commonData = genNewDataForGrid()

const getDataByPosition = position => commonData[position]

export { getInitData, getDataByPosition }
