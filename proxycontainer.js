let allData = {
    left:   [],
    center: [],
    right:  [],
    chbleft : '', 
    chbcenter : '', 
    chbright : ''
}

/*
    todo 
    1. Fill allData
    2. Move renderTable logic  from index.js
    3. Remove all comments and unused code

    DOM - index.js
    table generation  - proxycontainer.js
*/ 
const withProxy = container => new Proxy(container, containerProxyHandler)

const containerProxyHandler = 
{
    get(target, method, reciver)
    {
        if(method === 'renderTable')
            return function (...args)
            {
                debugger  
                const position = target.dataset.position
                const table = smartManager[position].getTable(allData[position]) //HTML Table 
                target.innerHTML = ''
                target.append(table)
            }
        return Reflect.get(...arguments)
    }
}

class ContainerManager {
    constructor (position) {
        this.position = position
        this.checkedIds = []
    }
    
    //Save checkboxes status
    getTable(data) 
    {
        //Set checkbox state

        //ToDo move from index.js  HTML
        outputTemplate.querySelectorAll('input[type="checkbox"][data-id]').forEach(el => {
            const id = el.dataset.id
            el.checked = this.checkedIds.includes(id)
            el.addEventListener('change', () => 
            {
                debugger
                if (this.checkedIds.includes(id)) {
                    this.checkedIds.splice(this.checkedIds.indexOf(id), 1)
                } else {
                    this.checkedIds.push(id)
                }
                //ToDo:  Need Impement  global refresh
            })

        })
    }
}



const smartManager = {
    left: new ContainerManager('left'),
    center: new ContainerManager('center'),
    right: new ContainerManager('right')
}

export {withProxy}