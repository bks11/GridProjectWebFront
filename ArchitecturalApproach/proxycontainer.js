import { genNewDataForGrid } from './dataproc.js'

let allData = genNewDataForGrid()

const 
    btnToRight = '<button type="button" class="btn btn-sm btn-outline-dark">></button>',
    btnToLeft = '<button type="button" class="btn btn-sm btn-outline-dark"><</button>'

/*
    todo 
    1. Fill allData
    2. Move renderTable logic  from index.js
    3. Remove all comments and unused code

    DOM - index.js
    table generation  - proxycontainer.js
*/ 

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

//Create proxy object
let withProxy = targetContainer => new Proxy(targetContainer, containerProxyHandler)
//targetContainer - is an object to wrap
//containerHandler - is an object that contains methods to control the behaviors of the "target". 
//                      The methods inside  the "handler" object are called traps


//Define handler object
const containerProxyHandler = 
{
    //Proxy trap
    //The get() trap is fired when a property of the "target" object is accessed via the proxy object
    get(target, method, reciver)
    {
        if(typeof target[method] == 'function')
	        return function (...args) 
            {
		        if(method === 'setAttribute') 
                {
                    console.log(args)
                    const position = args[1]//target.dataset.position
                    const table = smartManager[position].getTable(allData[position]) //HTML Table 
                    target.innerHTML = ''
                    target.append(table)
                } 
                return Reflect.apply(target[method], target, args)
            }
        if(method === 'renderTable')
            return function (...args)
            {
                const position = target.dataset.position
                const table = smartManager[position].getTable(allData[position]) //HTML Table 
                target.innerHTML = ''
                target.append(table)
            }
		return Reflect.get(...arguments)
    },
}

class ContainerManager {
    constructor (position) {
        this.position = position
        this.checkedIds = []
        this.btnCode = generateBtnCode(position)
    }
    
    getTable(data) 
    {
        //Set checkbox state
        //Render table
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

        //ToDo move from index.js  HTML
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
                //ToDo:  Need Impement  global refresh
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