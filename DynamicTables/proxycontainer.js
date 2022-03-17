
import { getGridsParams } from './datastore.js'
import { Container } from './container.js'


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
                    debugger
                    const position = args[1]
                    const table = target.container.drawTable()   //target.container -  new Container()
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

export { containerProxy }