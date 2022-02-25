import { withProxy, fillSmartManager } from './proxycontainer.js'
import { getInitData } from './datastore.js'

const topContainer = document.querySelector('#top-table-container')
const pillsContainer = document.querySelector('.nav')
const tabs = {}
const divs = {}

const createContainers = () => 
{
    const data = getInitData()
    let topDivs = ''
    let bottomPills = ''
    let iActive = true
    for(let prop in data) 
    {
        topDivs += `<div class="col-sm-4 tableFixHead" id="${prop}-div" data-position="${prop}"></div>`
        bottomPills += `<li class="nav-item">
                            <a  class="nav-link ${iActive ? 'active': ''}" 
                            id="tab-${prop}" 
                            data-toggle="pill" 
                            href="javascript:void(0)" 
                            aria-controls="${prop}-content" 
                            data-link="${prop}">${prop}</a>
                        </li>`
        
        
        iActive = false
    }
    topContainer.innerHTML = ''
    topContainer.innerHTML = topDivs
    pillsContainer.innerHTML = ''
    pillsContainer.innerHTML = bottomPills
    
    iActive = true
    for(let prop in data) 
    {
        tabs[prop] = document.querySelector(`a[data-link="${prop}"]`)
        divs[prop] = withProxy(document.querySelector(`#${prop}-div`))
        if(iActive) divs['gridcontainer'] = withProxy(document.querySelector('#gridcontainer'), tabs) 
        iActive = false
    }
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
        createContainers()
        addEvents(event)
        renderTables()
    }
    