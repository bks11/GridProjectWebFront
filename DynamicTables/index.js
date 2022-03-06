import { containerProxy, fillSmartManager } from './proxycontainer.js'
import { getInitData, getGridsParams } from './datastore.js'

const topContainer = document.querySelector('#top-table-container')
const pillsContainer = document.querySelector('.nav')
const divs = {}

const createContainers = () => 
{
    const positionsArr = getGridsParams()
    let topDivs = ''
    let bottomPills = ''
    
    positionsArr.forEach(p => {
        topDivs += `<div class="col-sm-4 tableFixHead" id="${p}-div" data-position="${p}"></div>`
        bottomPills += `<li class="nav-item">
                            <a  class="nav-link ${positionsArr.indexOf(p) === 0 ? 'active': ''}" 
                            id="tab-${p}" 
                            data-toggle="pill" 
                            href="javascript:void(0)" 
                            data-link="${p}">${p}</a>
                        </li>`
    })
    
    topContainer.innerHTML = ''
    topContainer.innerHTML = topDivs
    pillsContainer.innerHTML = ''
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
    