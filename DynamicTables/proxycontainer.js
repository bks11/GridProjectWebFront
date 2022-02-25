
import { withCheckBoxHandler, withRefreshTableHandler } from './hoc.js'
import { getDataByPosition, moveRow, getFullData } from './datastore.js'

const containers = []

let fullData = {}

class ContainerManager {
    
    constructor (position) {
        this.position = position
        this.checkedIds = withCheckBoxHandler([], position) 
        this.moveRow = withRefreshTableHandler(moveRow, containers)
    }
    
    generateBtnCode(id, position) 
    {
        const positionsArr = Object.keys(fullData)
        const dataPosCount = positionsArr.length 
        
        const idx = positionsArr.indexOf(position)
        if(idx === 0) 
            return `<button class="btn btn-sm btn-outline-dark" data-id="${id}" data-direct="${positionsArr[1]}">></button>`
        else if(idx === dataPosCount - 1)
            return `<button class="btn btn-sm btn-outline-dark" data-id="${id}" data-direct="${positionsArr[dataPosCount - 2]}"><</button>`
        else 
        {
            return `<button class="btn btn-sm btn-outline-dark" data-id="${id}" data-direct="${positionsArr[idx - 1]}"><</button>` +
                `<button class="btn btn-sm btn-outline-dark" data-id="${id}" data-direct="${positionsArr[idx + 1]}">></button>`
        }
    }

    drawTable() 
    {
        const data =  getDataByPosition(this.position)  
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
                            <div class="btn-group btn-group-sm"> ${this.generateBtnCode(x.id, this.position)}</div>
                        </td>
                    </tr>`),

            template = document.createElement('template')
            template.innerHTML = `<table class="table table-bordered tabel-sm cellpadОding="0">
                    <thead>
                        <tr>
                            <th><input type="checkbox" data-position="${this.position}"/></th>
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
        
        outputTemplate.querySelectorAll('input[type="checkbox"]').forEach(el => 
            el.addEventListener('change', e => this.checkedIds.toggle(el.dataset.id))
        )
        outputTemplate.querySelectorAll('button').forEach(b => 
            b.addEventListener('click', e => 
            {
                const moveOption = 
                {
                    id      : b.dataset.id,
                    from    : this.position,
                    to      : b.dataset.direct
                }                
                this.moveRow(moveOption)
                this.checkedIds.toggle(b.dataset.id, true)
            })
        )

        const headrChb = outputTemplate.querySelector(`input[type="checkbox"][data-position="${this.position}"]`)
        if(this.checkedIds.length < data.length && this.checkedIds.length !== 0) {
            headrChb.indeterminate = true
        } else if (this.checkedIds.length === 0) {
            headrChb.checked = false
            headrChb.indeterminate = false
        } else if (this.checkedIds.length === data.length) {
            headrChb.checked = true
            headrChb.indeterminate = false
        }
        
        return outputTemplate
    }
}

let smartManager = {}

const fillSmartManager = () => 
{
    fullData = getFullData()
    const positionsArr = Object.keys(fullData)
    positionsArr.forEach(p => {
        smartManager[p] = new ContainerManager(p)
    })
}

const withProxy = (targetContainer, tabs) => {
     const container = new Proxy(targetContainer, containerProxyHandler(tabs))
     containers.push(container)
     return container
}

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
                    const table = smartManager[position].drawTable()   
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

export { withProxy, fillSmartManager }