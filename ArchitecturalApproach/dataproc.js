//Utilites 
const generateUUIDUsingMathRandom = () => { 
    let d = new Date().getTime() 
    let d2 = (performance && performance.now && (performance.now()*1000)) || 0 
    return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0
            d = Math.floor (d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

const generateNumber = () => {
    let n = +(Math.random() * 15000).toFixed(2) 
    return new Intl.NumberFormat('en-US', {minimumFractionDigits: 2}).format(n)
}

const generateDate = () => 
{
    const momentDate = moment().format('MM/DD/YYYY h:mm:ss a')
    return momentDate
}

const capitalizeFirstLetter = ([ first, ...rest ], locale = navigator.language) =>
  first.toLocaleUpperCase(locale) + rest.join('')  //substring(1)
///
///
const genGridDataItem = (gridPosition) =>
{
    const n = generateNumber()
    const d =   {
                    chbstatus : false,
                    id: generateUUIDUsingMathRandom(),
                    valname: capitalizeFirstLetter(`${gridPosition}-${moment().format('sss')}`),
                    amount: n,
                    date: generateDate(),
                    flag: +((Math.random() * 15000).toFixed(0)) % 3 === 0
                }
    return d
}
const genDataForGrid = gridPosition => 
{   
    const alterResult = Array.from({length: 3}, () =>  genGridDataItem(gridPosition))
    return alterResult
}

const genNewDataForGrid = () => 
{    
    //debugger
    let data = {
        left:   genDataForGrid('left'),
        center: genDataForGrid('center'),
        right:  genDataForGrid('right'),
    } 
    //debugger    
    return data
}

export { genDataForGrid, genNewDataForGrid }