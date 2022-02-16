const checkBoxHandler = data => ({
    get(target, method) {
        //debugger
        if(method === 'toggle') 
        {
            return function (id) 
            {
                const position = data.position
                const allData = data.allData
                const headrChbs = document.querySelectorAll(`input[type="checkbox"][data-position="${position}"]`)
                const checkboxes = document.querySelectorAll(`input[type="checkbox"][data-id="${id}"]`)
                if(id)
                {
                    if(target.includes(id))
                    {
                        target.splice(target.indexOf(id), 1)
                        checkboxes.forEach(c => c.checked = false)
                    } else 
                    {
                        target.push(id)
                        checkboxes.forEach(c => c.checked = true)
                    } 
                } 
                else // Header chb action 
                {
                    if(target.length < allData[position].length) {
                        target.splice(0, target.length)
                        allData[position].forEach(d => target.push(d.id))
                        target.forEach(el => {
                            document.querySelectorAll(`input[type="checkbox"][data-id="${el}"]`).forEach(
                                chb => chb.checked = true
                            )
                        })
                    } else if (target.length === allData[position].length) {
                        target.forEach(el => {
                            document.querySelectorAll(`input[type="checkbox"][data-id="${el}"]`).forEach(
                                chb => chb.checked = false
                            )
                        })    
                        target.splice(0, target.length)
                    }
                }
                
                if(target.length < allData[position].length && target.length !== 0) {
                    headrChbs.forEach(
                        el => el.indeterminate = true
                    )
                } else if (target.length === 0) {
                    headrChbs.forEach(el => {
                        el.checked = false
                        el.indeterminate = false
                    })
                } else if (target.length === allData[position].length) {
                    headrChbs.forEach(el => {
                        el.checked = true
                        el.indeterminate = false
                    })
                }
            }
        }
        return Reflect.get(...arguments)
    }
})

const withCheckBoxHandler = (checkedIds, grdData) => 
{
    return new Proxy(checkedIds, checkBoxHandler(grdData))
}

export { withCheckBoxHandler }