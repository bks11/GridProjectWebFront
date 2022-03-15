import { containerProxy, ContainerManager } from './proxycontainer.js'
import { setInitData, getGridsParams } from './datastore.js'

const topContainer      = document.querySelector('#top-table-container')
const pillsContainer    = document.querySelector('.nav')
let containerManager    = {}

const createContainers = (positionsArr) => 
{
    const topDivs = positionsArr.reduce((init, key) => init + 
                                `<div class="col-sm-4 tableFixHead" id="${key}-div" data-position="${key}"></div>`, '')
    const bottomPills = positionsArr.reduce((init, key, index) => init +
                    `<li class="nav-item">
                        <a  class="nav-link ${index === 0 ? 'active': ''}" 
                            id="tab-${key}" 
                            data-toggle="pill" 
                            href="javascript:void(0)" 
                            data-link="${key}">${key}</a>
                    </li>`,'')    
    
    topContainer.innerHTML = topDivs
    pillsContainer.innerHTML = bottomPills
    const tabs = {}
    const divs = {}
    
    positionsArr.reduce((init, key) => 
    {
        tabs[key] = document.querySelector(`a[data-link="${key}"]`)
        tabs[key].addEventListener('click', push)
    }, positionsArr[0])
    
    positionsArr.reduce((init, key) => divs[key] = containerProxy(document.querySelector(`#${key}-div`)), positionsArr[0])
    divs['gridcontainer'] = containerProxy(document.querySelector('#gridcontainer'), tabs) 

    return divs
}

const getContainer = (key) => containerManager.containers[key]


const push = event => {
    const id = event.target.id
    const position = event.target.getAttribute('data-link')
    containerManager.divs['gridcontainer'].setAttribute('data-position', position)
    window.history.pushState({ id }, ``, `/${position}`)
}
   
window.onload = () => {
    
    const positionsArr = setInitData() //    Get data and return keys 
    const divs = createContainers(positionsArr) 
    containerManager = new ContainerManager(positionsArr, divs)
    containerManager.renderTables()

}

export { getContainer }
    