import { withProxy, fillSmartManager } from './proxycontainer.js'
import { getInitData, getGridsParams } from './datastore.js'

const topContainer = document.querySelector('#top-table-container')
const pillsContainer = document.querySelector('.nav')
const tabs = {}
const divs = {}

const createContainers = () => 
{
    const positionsArr = getGridsParams()
    let topDivs = ''
    let bottomPills = ''
    let iActive = true
    positionsArr.forEach(p => {
        topDivs += `<div class="col-sm-4 tableFixHead" id="${p}-div" data-position="${p}"></div>`
        bottomPills += `<li class="nav-item">
                            <a  class="nav-link ${iActive ? 'active': ''}" 
                            id="tab-${p}" 
                            data-toggle="pill" 
                            href="javascript:void(0)" 
                            aria-controls="${p}-content" 
                            data-link="${p}">${p}</a>
                        </li>`
        iActive = false
    })
    
    topContainer.innerHTML = ''
    topContainer.innerHTML = topDivs
    pillsContainer.innerHTML = ''
    pillsContainer.innerHTML = bottomPills
    
    iActive = true
    positionsArr.forEach(p => {
        tabs[p] = document.querySelector(`a[data-link="${p}"]`)
        divs[p] = withProxy(document.querySelector(`#${p}-div`))
        if(iActive) divs['gridcontainer'] = withProxy(document.querySelector('#gridcontainer'), tabs) 
        iActive = false
    })
}
    
const renderTables = () => {
    let isFirst = true
    fillSmartManager()
    for(let key in divs)
    {   
        if(isFirst) divs['gridcontainer'].setAttribute('data-position', key)
        if(key !== 'gridcontainer') divs[key].setAttribute('data-position', key)
        isFirst = false
    }
}

const addEvents = () => 
{
    for (let tab in tabs ) 
    {
        tabs[tab].addEventListener('click', push)
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
        addEvents(event)
        renderTables()
    }
    