import { Container } from './container.js'

class ContainerManager 
{
    constructor (positionsArr, divs) 
    {
        this.divs = divs
        this.containers = {}
        positionsArr.forEach(key => {
            debugger
            this.containers[key] = new Container(key)
        })
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

export { ContainerManager }