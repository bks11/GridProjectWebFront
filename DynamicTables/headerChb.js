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

export { setHeaderChbStatus }