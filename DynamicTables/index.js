import { containerProxy } from './proxycontainer.js'
import { setInitData, getGridsParams } from './datastore.js'
import { ContainerManager } from './containerManager.js'

const topContainer      = document.querySelector('#top-table-container')
const pillsContainer    = document.querySelector('.nav')

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
    
    const tabs = positionsArr.reduce((obj, key) => (obj[key] = document.querySelector(`a[data-link="${key}"]`), obj), {})
    const divs = positionsArr.reduce(
        (obj, key) => 
        {
            obj[key] = containerProxy(document.querySelector(`#${key}-div`))
            return obj
        },//function 
        { 
            gridcontainer : containerProxy(document.querySelector('#gridcontainer'), tabs) 
        }//initial value
    )

    positionsArr.forEach(key => tabs[key].addEventListener('click', push(divs.gridcontainer)))
      
    return divs
}

const push = gridcontainer => event => {
    const id = event.target.id
    const position = event.target.getAttribute('data-link')
    gridcontainer.setAttribute('data-position', position)
    window.history.pushState({ id }, ``, `/${position}`)
}
   
window.onload = () => {
    const positionsArr = setInitData() //    Get data and return keys 
    const divs = createContainers(positionsArr) 
    const containerManager = new ContainerManager(positionsArr, divs)
    containerManager.renderTables()
}












//https://www.digitalocean.com/community/tutorials/understanding-objects-in-javascript
//Proxy - https://levelup.gitconnected.com/the-amazing-power-of-javascript-proxies-aa27c6d06bcb
//Proxy and reflect - https://medium.com/swlh/lets-learn-proxy-and-reflect-4d2ab7827b85
//Reflect - https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Reflect/apply    
//Handler - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/set
//Proxy and reflect - https://www.w3docs.com/learn-javascript/proxy-and-reflect.html
//Array - https://www.digitalocean.com/community/tutorials/understanding-arrays-in-javascript
//Object to array - https://www.javascripttutorial.net/object/convert-an-object-to-an-array-in-javascript/
//Search in array  - https://www.digitalocean.com/community/tutorials/js-array-search-methods-ru
//Proxy - https://www.javascripttutorial.net/es6/javascript-proxy/
//Proxy - https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Proxy
//English Mania  - https://english-mania.ru/application-form-page
//Modules - https://web-standards.ru/articles/es-modules-cartoon-dive/
//Proxy - https://blog.bitsrc.io/a-practical-guide-to-es6-proxy-229079c3c2f0