import { getDataByPosition } from './datastore.js'

const checkBoxHandler = position => ({   
    get(target, method) {
        if(method === 'toggle') 
        {
            return function (id) 
            {
                const data = getDataByPosition(position)
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
                    const setChecked = flag => 
                    {
                        target.forEach(el => document.querySelectorAll(`input[type="checkbox"][data-id="${el}"]`).forEach(
                            chb => chb.checked = flag
                        ))
                    }

                    if(target.length < data.length) 
                    {
                        target.splice(0, target.length)
                        data.forEach(d => target.push(d.id))
                        setChecked(true)
                    } 
                    else if (target.length === data.length) 
                    {
                        setChecked(false)    
                        target.splice(0, target.length)
                    }
                }
            }
        }
        return Reflect.get(...arguments)
    }
})

const moveRowHandler = containers => 
({
    apply(target, thisArgs, reciver)
    {
        const result  = Reflect.apply(...arguments)
        const from = reciver[0].from
        const to = reciver[0].to
        const id = reciver[0].id
        
        containers.forEach(c => 
            {
                if(c.getAttribute('data-position') === from) c.setAttribute('data-position', from)
                if(c.getAttribute('data-position') === to) c.setAttribute('data-position', to)
            }
        )
        return result
    }
})



const headerCheckboxHandler = () =>
({
    get(target, method)
    {
        if(method === 'setHeaderChbStatus')
        {
            return function(chekedIdsArr, position)
            {
                const data = getDataByPosition(position)
                const headrChbs = document.querySelectorAll(`input[type="checkbox"][data-position="${position}"]`)
                if(chekedIdsArr.length < data.length && chekedIdsArr.length !== 0) {
                    headrChbs.forEach(
                        el => el.indeterminate = true
                    )
                } else if (chekedIdsArr.length === 0) {
                    headrChbs.forEach(el => {
                        el.checked = false
                        el.indeterminate = false
                    })
                } else if (chekedIdsArr.length === data.length) {
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

const moveRowProxy = (target, containers) => new Proxy(target, moveRowHandler(containers))

const checkBoxProxy = (array, position) => new Proxy(array, checkBoxHandler(position))  //Instiad return!!!!

const headerCheckboxProxy = (target) => new Proxy(target, headerCheckboxHandler())

export { checkBoxProxy, moveRowProxy, headerCheckboxProxy}