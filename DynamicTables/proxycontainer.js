
import { getGridsParams } from './datastore.js'
import { Container } from './container.js'
import { getContainer } from './index.js'

//Create constuctor!

class ContainerManager 
{
    constructor (positionsArr, divs) 
    {
        this.divs = divs
        this.containers = {}
        positionsArr.forEach(key => this.containers[key] = new Container(key))
    }
    
    renderTables()
    {
        this.divs
        for(let key in this.divs)
        {   
            if(Object.keys(this.divs).indexOf(key) === 0) this.divs['gridcontainer'].setAttribute('data-position', key)
            if(key !== 'gridcontainer') this.divs[key].setAttribute('data-position', key)
        }
    }
}

const containerProxy = (targetContainer, tabs) => {
     const container = new Proxy(targetContainer, containerProxyHandler(tabs))
     return container
}

const containerProxyHandler = (tabs) => 
({
    get(target, method, reciver)
    {   
        if(typeof target[method] == 'function')
	        return function (...args) 
            {
		        if(method === 'setAttribute') 
                {
                    const position = args[1]
                    const table = getContainer(position).drawTable()   
                    target.innerHTML = ''
                    target.append(table)
                    if(tabs)
                    {
                        for(let tab in tabs)
                        {
                            tabs[tab].classList.remove('active')
                        }
                        tabs[position].classList.add('active')
                    }
                } 
                return Reflect.apply(target[method], target, args)
            }
		return Reflect.get(...arguments)
    }
})

export { containerProxy, ContainerManager }