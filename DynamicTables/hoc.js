import { getDataByPosition } from './datastore.js'
import { setHeaderChbStatus } from './headerChb.js'

const checkBoxHandler  = 
{   
    get(target, method) 
    {
        if(method === 'toggle') 
        {
            return function (id, position) 
            {
                const data = getDataByPosition(position)
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
}

const moveRowHandler = containers => 
({
    apply(target, thisArgs, args)
    {
        debugger
        const result    = Reflect.apply(...arguments)
        const from      = args[0].from
        const to        = args[0].to
    
        containers.forEach(c => 
            {
                if(c.getAttribute('data-position') === from) c.setAttribute('data-position', from)
                if(c.getAttribute('data-position') === to) c.setAttribute('data-position', to)
            }
        )
        return result
    }
})


const headerCheckboxHandler = position => 
{
    const handler = array => 
    {
        const data = getDataByPosition(position)
        const headrChbs = document.querySelectorAll(`input[type="checkbox"][data-position="${position}"]`)
        setHeaderChbStatus(array, data, headrChbs)
    }
    return {
        get(target, method, reciever)
        {
            if(method === 'toggle')
            {
                return function()
                {
                    const result = target[method](...arguments, position)
                    handler(target)    
                    return result
                }
            }
            return Reflect.get(...arguments)
        },
        apply(target, thisArgs, args)
        {
            const result = Reflect.apply(...arguments)
            return result
        }
    }
}


const headerCheckboxProxy = (target, position) => new Proxy(target, headerCheckboxHandler(position))

const moveRowProxy = (target, containers) => new Proxy(target, moveRowHandler(containers))

const checkBoxProxy = array => new Proxy(array, checkBoxHandler)  //Instiad return!!!!


export { checkBoxProxy, moveRowProxy, headerCheckboxProxy}