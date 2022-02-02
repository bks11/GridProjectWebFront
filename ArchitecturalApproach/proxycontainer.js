import { genNewDataForGrid } from './dataproc.js'

let allData = genNewDataForGrid()

const 
    btnToRight = '<button type="button" class="btn btn-sm btn-outline-dark">></button>',
    btnToLeft = '<button type="button" class="btn btn-sm btn-outline-dark"><</button>'

const generateBtnCode = position => 
{
    if(position === 'left') {
        return `<div class="btn-group btn-group-sm">${btnToRight}</div>`
    } else if(position === 'center') {
        return `<div class="btn-group btn-group-sm">${btnToLeft}${btnToRight}</div>`
    } else if(position === 'right') {
        return `<div class="btn-group btn-group-sm">${btnToLeft}</div>`
    }
}

let withProxy = targetContainer => new Proxy(targetContainer, containerProxyHandler)

const containerProxyHandler = 
{
    get(target, method, reciver)
    {
        if(typeof target[method] == 'function')
	        return function (...args) 
            {
		        if(method === 'setAttribute') 
                {
                    const position = args[1]
                    const table = smartManager[position].getTable(allData[position]) 
                    target.innerHTML = ''
                    target.append(table)
                } 
                return Reflect.apply(target[method], target, args)
            }
		return Reflect.get(...arguments)
    }
}

class ContainerManager {
    constructor (position) {
        this.position = position
        this.checkedIds = []
        this.btnCode = generateBtnCode(position)
    }
    
    getTable(data) 
    {
        const dataMap = data.map(
            x => `<tr>
                        <td>
                            <input 
                                type="checkbox" 
                                class="chb${this.position}" 
                                data-id="${x.id}"
                                ${x.chbstatus ? 'checked':''}/>
                        </td>
                        <td>${x.id}</td>
                        <td>${x.valname}</td>
                        <td>${x.amount}</td>
                        <td>${x.date}</td>
                        <td align="center">${x.flag ? '<i class="fas fa-flag"></i>' : '<i class="far fa-flag"></i>'}</td>
                        <td>
                            ${this.btnCode}
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
            el.checked = this.checkedIds.includes(id)
            el.addEventListener('change', () => 
            {
                if (this.checkedIds.includes(id)) {
                    this.checkedIds.splice(this.checkedIds.indexOf(id), 1)
                } else {
                    this.checkedIds.push(id)
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

export { withProxy }