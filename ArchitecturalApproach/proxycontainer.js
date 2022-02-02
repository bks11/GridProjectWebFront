import { genDataForGrid, genNewDataForGrid } from './dataproc.js'

let allData = {
    left:   [],
    center: [],
    right:  [] 
}

/*
    todo 
    1. Fill allData
    2. Move renderTable logic  from index.js
    3. Remove all comments and unused code

    DOM - index.js
    table generation  - proxycontainer.js
*/ 
allData = genNewDataForGrid()

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
    get(target, method)
    {
        //debugger
        if(method === 'renderTable')
            return function (...args)
            {
                //debugger  
                const position = target.dataset.position
                const table = smartManager[position].getTable(allData[position]) //HTML Table 
                target.innerHTML = ''
                target.append(table)
            }
        //return Reflect.get(...arguments)
        return Reflect.get(target)
    },
    set(target, property, value)
    {
        //debugger
        if (property === 'position')  {
            target.setAttribute('data-position', value)
            target[property] = value
            console.log(value)
            return true
          } else 
          {
            return Reflect.set(...arguments);
          }
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
        //Render table
        //debugger
        const dataMap = data.map(
            x => `<tr>
                        <td>
                            <input 
                                type="checkbox" 
                                class="chb${this.position}" 
                                id="chb-${x.id}"
                                data-parent="chbheader-${this.position}"
                                data-position="${this.position}"
                                data-id="${x.id}"
                                ${x.chbstatus ? 'checked':''}/>
                        </td>
                        <td>${x.id}</td>
                        <td>${x.valname}</td>
                        <td>${x.amount}</td>
                        <td>${x.date}</td>
                        <td align="center">${x.flag ? '<i class="fas fa-flag"></i>' : '<i class="far fa-flag"></i>'}</td>
                        <td>
                            <div class='btn-group btn-group-sm'> 
                            <button type='button' class='btn btn-sm btn-outline-dark'><</button> <button type='button' class='btn btn-sm btn-outline-dark'>></button>
                            </div>
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
                debugger
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