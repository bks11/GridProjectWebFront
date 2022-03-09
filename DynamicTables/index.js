import { containerProxy, fillSmartManager } from './proxycontainer.js'
import { getInitData, getGridsParams } from './datastore.js'

const topContainer = document.querySelector('#top-table-container')
const pillsContainer = document.querySelector('.nav')
const divs = {}

const createContainers = () => 
{
    const positionsArr = getGridsParams()
    debugger
    const topDivs = positionsArr.reduce((init, result) => init + `<div class="col-sm-4 tableFixHead" id="${result}-div" data-position="${result}"></div>`, '')
    const bottomPills = positionsArr.reduce((init, result, index) => init +
                    `<li class="nav-item">
                        <a  class="nav-link ${index === 0 ? 'active': ''}" 
                            id="tab-${result}" 
                            data-toggle="pill" 
                            href="javascript:void(0)" 
                            data-link="${result}">${result}</a>
                    </li>`, '')    
    
    topContainer.innerHTML = topDivs
    pillsContainer.innerHTML = bottomPills
    const tabs = {}
    positionsArr.forEach(p => {
        tabs[p] = document.querySelector(`a[data-link="${p}"]`)
        tabs[p].addEventListener('click', push)
        divs[p] = containerProxy(document.querySelector(`#${p}-div`))
    })
    divs['gridcontainer'] = containerProxy(document.querySelector('#gridcontainer'), tabs) 
}
    
const renderTables = () => {
    fillSmartManager()
    for(let key in divs)
    {   
        if(Object.keys(divs).indexOf(key) === 0) divs['gridcontainer'].setAttribute('data-position', key)
        if(key !== 'gridcontainer') divs[key].setAttribute('data-position', key)
    }
}

const push = event => {
    const id = event.target.id
    const position = event.target.getAttribute('data-link')
    divs['gridcontainer'].setAttribute('data-position', position)
    window.history.pushState({ id }, ``, `/${position}`);
}
    
    window.onload = event => {
        getInitData()
        createContainers()
        renderTables()
    }
    