const setHeaderChbStatus = (checkedIdsArr, data, checkboxes) => 
{
    if(checkedIdsArr.length < data.length && checkedIdsArr.length !== 0) {
        checkboxes.forEach(
            el => el.indeterminate = true
        )
    } else if (checkedIdsArr.length === 0) {
        checkboxes.forEach(el => {
            el.checked = false
            el.indeterminate = false
        })
    } else if (checkedIdsArr.length === data.length) {
        checkboxes.forEach(el => {
            el.checked = true
            el.indeterminate = false
        })
    }
}

const testReduce = () => 
{
    const arr = ['a', 'b', 'c']
    debugger
    let v = arr.reduce((init, result) => {

        return init + `<div class="col-sm-4 tableFixHead" id="${result}-div" data-position="${result}"></div>`
    }, '')
    debugger
    return v
}

export { setHeaderChbStatus }