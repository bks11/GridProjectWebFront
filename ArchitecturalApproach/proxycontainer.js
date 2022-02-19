
import { withCheckBoxHandler } from './hoc.js'
import { getDataByPosition, moveRow } from './datastore.js'

class ContainerManager {
    
    constructor (position) {
        this.position = position
        this.checkedIds = withCheckBoxHandler([], position) 
    }

    generateBtnCode(id) 
    {
        const btnToRight = `<button class="btn btn-sm btn-outline-dark" data-id="${id}" data-direct="right">></button>`
        const btnToLeft = `<button class="btn btn-sm btn-outline-dark" data-id="${id}" data-direct="left"><</button>`
        if(this.position === 'left') {
            return btnToRight
        } else if(this.position === 'center') {
            return btnToLeft + btnToRight
        } else if(this.position === 'right') {
            return btnToLeft
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
                            <div class="btn-group btn-group-sm"> ${this.generateBtnCode(x.id)}</div>
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
            b.addEventListener('click', e => moveRow(b.dataset.id, b.dataset.direct, this.position)))

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

export { withProxy }