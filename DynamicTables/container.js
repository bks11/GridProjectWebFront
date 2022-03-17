import { checkBoxProxy, moveRowProxy, headerCheckboxProxy } from './hoc.js'
import { getDataByPosition, moveRow, getGridsParams } from './datastore.js'
import { setHeaderChbStatus } from './headerChb.js'

class Container {
    
    constructor (position) {
        this.position = position
        this.checkedIds = headerCheckboxProxy(checkBoxProxy([]), position)
        //this.moveRow = headerCheckboxProxy(moveRowProxy(moveRow, containers), position) //???
    }
    
    generateBtnCode(id, position) 
    {
        const positionsArr = getGridsParams()
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
            el.addEventListener('change', e => 
            {
                this.checkedIds.toggle(el.dataset.id)
            })
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
                if(this.checkedIds.includes(moveOption.id)) 
                    this.checkedIds.splice(this.checkedIds.indexOf(moveOption.id), 1)

                this.moveRow(moveOption)
            })
        )
        const headrChb = outputTemplate.querySelectorAll(`input[type="checkbox"][data-position="${this.position}"]`)
        setHeaderChbStatus(this.checkedIds, data, headrChb)
    
        return outputTemplate
    }
}




export { Container }