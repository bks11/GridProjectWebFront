import { genNewDataForGrid } from './dataproc.js'

let allData = genNewDataForGrid()

class ContainerManager {
    
    constructor (position) {
        this.position = position
        const checkboxHandler = {
            get(target, method)
            {
                if(method === 'toggle')
                {
                    return function (id) 
                    {
                        const checkboxes = document.querySelectorAll(`input[type="checkbox"][data-id="${id}"]`)
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
                }
                return Reflect.get(...arguments)    
            }
        }
        this.checkedIds = new Proxy([], checkboxHandler)
    }

    generateBtnCode() 
    {
        const btnToRight = '<button class="btn btn-sm btn-outline-dark">></button>'
        const btnToLeft = '<button class="btn btn-sm btn-outline-dark"><</button>'
        if(this.position === 'left') {
            return btnToRight
        } else if(this.position === 'center') {
            return btnToLeft + btnToRight
        } else if(this.position === 'right') {
            return btnToLeft
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
                            <div class="btn-group btn-group-sm"> ${this.generateBtnCode()}</div>
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
            el.addEventListener('change', () => 
            {
                this.checkedIds.toggle(id)
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