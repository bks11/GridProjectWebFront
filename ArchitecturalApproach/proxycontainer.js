import { genNewDataForGrid } from './dataproc.js'
import { checkboxProxy } from './proxyCheckboxes.js'

let allData = genNewDataForGrid()

const checkFirstIds = position => {
    return allData[position][0].id
}

class ContainerManager {

    constructor (position) {
        this.btnToRight = '<button type="button" class="btn btn-sm btn-outline-dark">></button>'
        this.btnToLeft = '<button type="button" class="btn btn-sm btn-outline-dark"><</button>'
        this.position = position
        this.checkedIds = [checkFirstIds(position)]
        this.proxyElements = []
    }
     
    generateBtnCode = position => 
    {
        if(position === 'left') {
            return this.btnToRight
        } else if(position === 'center') {
            return this.btnToLeft + this.btnToRight
        } else if(position === 'right') {
            return this.btnToLeft
        }
    }
    
    drawTable(data) 
    {
        const dataMap = data.map(
            x => `<tr>
                        <td>
                            <input 
                                type="checkbox" 
                                
                                data-id="${x.id}"
                                ${this.checkedIds.includes(x.id) ? 'checked':''}/>
                        </td>
                        <td>${x.id}</td>
                        <td>${x.valname}</td>
                        <td>${x.amount}</td>
                        <td>${x.date}</td>
                        <td align="center">${x.flag ? '<i class="fas fa-flag"></i>' : '<i class="far fa-flag"></i>'}</td>
                        <td>
                            <div class="btn-group btn-group-sm"> ${this.generateBtnCode(this.position)}</div>
                        </td>
                    </tr>`),

            template = document.createElement('template')
            template.innerHTML = `<table class="table table-bordered tabel-sm cellpadОding="0">
                    <thead>
                        <tr>
                            <th><input type="checkbox"/></th>
                            <th>id</th>
                            <th>name</th>
                            <th>amount</t>
                            <th>date</th>
                            <th>DIV 3?</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dataMap.join('')}
                    </tbody>
                </table>`
        const outputTemplate = template.content.cloneNode(true)
        outputTemplate.querySelectorAll('input[type="checkbox"][data-id]').forEach(el => {
            const id = el.dataset.id
            this.proxyElements.push(withProxy(el))
            withProxy(el).addEventListener('change', () => 
            {
                if (this.checkedIds.includes(id)) {
                    this.checkedIds.splice(this.checkedIds.indexOf(id), 1)
                } else {
                    checkboxProxy(this.checkedIds).push(id)
                }
            })
        })
        return outputTemplate
    }
}

const smartManager = {
    left: new ContainerManager('left'),
    center: new ContainerManager('center'),
    right: new ContainerManager('right')
}



let withProxy = (targetContainer, tabs) => new Proxy(targetContainer, containerProxyHandler(tabs))

const containerProxyHandler = tabs => 
({
    get(target, method, reciver)
    {        
        if(typeof target[method] == 'function')
	        return function (...args) 
            {
		        if(method === 'setAttribute') 
                {
                    const position = args[1]
                    const table = smartManager[position].drawTable(allData[position]) 
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

export { withProxy }