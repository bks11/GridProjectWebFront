import { withProxy } from './proxycontainer.js'
import { genDataForGrid, genNewDataForGrid } from './dataproc.js'

// let data = {
//     left:   [],
//     center: [],
//     right:  [],
//     chbleft : '', 
//     chbcenter : '', 
//     chbright : ''
// }

const
    leftdiv         = withProxy(document.querySelector('#left-div')),
    centerdiv       = withProxy(document.querySelector('#center-div')),
    rightdiv        = withProxy(document.querySelector('#right-div')),

    gridcontainer   = withProxy(document.querySelector('#gridcontainer')),
    tabLeft         = document.querySelector('#tab-left'),
    tabCenter       = document.querySelector('#tab-center'),
    tabRight        = document.querySelector('#tab-right')




//Uncaught TypeError: Cannot set properties of undefined (setting 'BootstrapTable'
//dataCenter  = [{id, valname, amount, today, flag}],
//dataRight   = [{id, valname, amount, today, flag}]
//https://www.grapecity.com/wijmo/demos/Grid/Selection/CheckboxSelection/purejs
//https://freefrontend.com/css-tabs/
//https://codepen.io/inupurnomo/pen/MWWRmQr
//Bootstrap TABS  - https://mdbootstrap.com/docs/b4/jquery/components/tabs/    https://getbootstrap.com/docs/5.1/components/navs-tabs/
//Bootstrap GRID SYSTEM  - https://getbootstrap.com/docs/4.0/layout/grid/
// Icons  and buttons images   - https://fontawesome.com/
//Date time format  - https://stackoverflow.com/questions/8362952/javascript-output-current-datetime-in-yyyy-mm-dd-hhmsec-format
//Frozen header for table  - https://bootstraptema.ru/stuff/snippets_bootstrap/elements/fiksirovannaja_shapka_tablicy/33-1-0-721
//Fixed header  - https://stackoverflow.com/questions/21168521/table-fixed-header-and-scrollable-body
//You do not need JQUERY  - https://youmightnotneedjquery.com/
//Vanilla JS - https://www.cat-in-web.ru/vanilla-js/
//Date time util - https://momentjs.com/ https://cdnjs.com/libraries/moment.js
//Richard Feynman - https://habr.com/ru/company/getmeit/blog/646085/
//Excel file - https://stackoverflow.com/questions/43728201/how-to-read-xlsx-and-xls-files-using-c-sharp-and-oledbconnection
//QuerySelector multiple data attributes -  document.querySelector('[data-point-id="7febe088-4eca-493b-8455-385b39ad30e3"][data-period="current"]')
//Checkboxes - https://css-tricks.com/indeterminate-checkboxes/
//Router vanila javascript - https://jstutorial.medium.com/making-your-own-vanilla-js-router-2e621ffdee88
//SPA Routing System in Vanilla JS - https://medium.com/@bryanmanuele/how-i-implemented-my-own-spa-routing-system-in-vanilla-js-49942e3c4573


// const router = async () =>{
//     const routes = [
//         {path: '/', view: () => console.log('Viewing left tab data')},
//         {path: '/center', view: () => console.log('Viewing center tab data')},
//         {path: '/right', view: () => console.log('Viewing right tab data')}
//     ]
//     //Test each route for potential match
//     const potentialMatches = routes.map(route => {
//         return {
//             route: route,
//             isMatch: location.pathname === route.path
//         }
//     })

//     let match = potentialMatches.find(potentialMatche => potentialMatche.isMatch)

//     if (!match) {
//         match = {
//             route: routes[0],
//             isMatch: true
//         }
//     }

//     console.log(potentialMatches)
//     console.log(match.route.view())
// }

const rowText = tableRow => {
    const id = tableRow.childNodes[3].innerHTML
    //console.log(id)
    return id
}

const setRowsAction = tblRows => { 
    for(const r of tblRows ){
        r.onclick = function() {
            rowText(this)
        }
    }
}

const setActionForAllRows = () => {
    document.querySelectorAll('table').forEach(t => setRowsAction(t.rows))
}
//Checkbox section
const saveChbStatus = (id, position, status) => {
    //debugger
    const dataChbProperty = `chb${position}`

    data[position].forEach(o => {
        if(o.id === id) {
            //debugger
            o.chbstatus = status
        }
    })
    
    document.querySelectorAll(`.chbheader-${position}`).forEach(chb => {
        if(chb.indeterminate === true) {
            data[dataChbProperty] = undefined
        } else 
        {
            chb.checked ? data[dataChbProperty] = true : data[dataChbProperty] = false
        }
        console.log(data[dataChbProperty])
    })
}

const setMainChbStatus = (mainChb, totalItems, selectedItems) =>
{
    if (selectedItems === totalItems) {
        mainChb.forEach(c => {
            c.indeterminate = false
            c.checked = true
        })
    } else { 
        if (selectedItems === 0) {
            mainChb.forEach(c => {
                c.indeterminate = false
                c.checked = false
            }) 
        } else {
            mainChb.forEach(c => {
                c.indeterminate = true
                c.checked = false
            })
        }
    }
}

const renderMainChbStatus = container => {
    const 
        // l = data.chbleft,
        // c = data.chbcenter,
        // r = data.chbright
        //
        position = container.dataset.position //https://stackoverflow.com/questions/33760520/how-can-i-get-the-values-of-data-attributes-in-javascript-code
        const chb = container.querySelector('table thead input[type="checkbox"]')
        const chbData = data[`chb${position}`]

        chb.indeterminate = chbData === undefined
        chb.checked = !!chbData  //convert to bool  
}
const checkboxAction = (e) => 
{
    const chbRole = e.target.getAttribute('data-parent')
    console.log(`Checkbox role is ${chbRole}`)
    const isChecked = e.target.checked
    if (chbRole === 'main') {
        const chbContainerPosition = e.target.getAttribute('data-position')
        document.querySelectorAll(`.chb${chbContainerPosition}`).forEach(c => {
            let idGUID = c.getAttribute('id').substring(4)
            c.checked = isChecked
            saveChbStatus(idGUID, chbContainerPosition, isChecked)
            document.querySelectorAll(`.chbheader-${chbContainerPosition}`).forEach(m => {
                m.checked = isChecked
            })
        }) 
    } else {
        let selectedChild = 0
        const 
            className               = e.target.getAttribute('class'),
            chbContainerPosition    = e.target.getAttribute('data-position'),
            id                      = e.target.getAttribute('id'),
            recGUID                 = id.substring(4),
            totalItems              = document.querySelectorAll(`.${className}`).length,
            child                   = document.querySelectorAll(`.${className}`),
            chbMain                 = document.querySelectorAll(`.chbheader-${chbContainerPosition}`)

        document.querySelectorAll(`#${id}`).forEach(c => {
            c.checked = isChecked
        })

        for(let i = 0; i < totalItems; i++) {
            selectedChild += child[i].checked
        }

        setMainChbStatus(chbMain, totalItems, selectedChild)
        saveChbStatus(recGUID, chbContainerPosition, isChecked)
        console.log(`selected child ${selectedChild}`)
        console.log(className)
        console.log(id)
        console.log(totalItems)
        console.log(document.querySelectorAll(`#${id}`).length)
    }

    console.log(e.target.getAttribute('class'))
    //let parentNode = this.parentNode
    //console.log(this.getAttribute('class'))
}

const processCheckboxes = () => 
{
    const checkBoxes = document.querySelectorAll('input[type="checkbox"]')
    for(let i = 0; i < checkBoxes.length; i++)
    {
        checkBoxes[i].removeEventListener('change', checkboxAction)
    }
    for(let i = 0; i < checkBoxes.length; i++)
    {
        checkBoxes[i].addEventListener('change', checkboxAction)
    }
}

//const checkBoxes = document.querySelectorAll('input[type="checkbox"],[data-position="left"]')


const nodeArray = (selector, parent=document) => [].slice.call(parent.querySelectorAll(selector));
const refreshTable = container => 
{
    renderTable(container)
    processCheckboxes()
}
//const renderTable = container => container.renderTable()

const renderTable = container => {
    debugger
    container.renderTable()
    debugger
    container.innerHTML = ''
    const position = container.getAttribute("data-position")
    let btnCode
    if (position == "left") {
        btnCode = "<button type='button' class='btn btn-sm btn-outline-dark'>></button>"
    } else if (position == "center") {
        btnCode = "<button type='button' class='btn btn-sm btn-outline-dark'><</button> <button type='button' class='btn btn-sm btn-outline-dark'>></button>"
    } else if (position == 'right') {
        btnCode = "<button type='button' class='btn btn-sm btn-outline-dark'><</button>"
    }
    const dataMap = data[position].map(
                            x => `<tr>
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                class="chb${position}" 
                                                id="chb-${x.id}"
                                                data-parent="chbheader-${position}"
                                                data-position="${position}"
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
                                                ${btnCode}
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
    
    container.append(template.content.cloneNode(true))
    renderMainChbStatus(container)
}

const renderTables = () => {
    [leftdiv, centerdiv, rightdiv, gridcontainer].forEach(refreshTable)
    //Example to learn! - [leftdiv,centerdiv, rightdiv, gridcontainer].forEach(c => renderTable(c))
}
const selectTab = id => {
    document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active'))
    //console.log(`#${id}`)
    document.querySelectorAll(`#${id}`).forEach(item => item.classList.add('active'))
}

const push = event => {
    // Get id attribute of the button or link clicked
    const id = event.target.id
    //console.log(`ID = ${id}`)
    //console.log(event.target)
    const position = event.target.getAttribute('data-link')
    gridcontainer.innerHTML = ''
    gridcontainer.setAttribute('data-position', position)
    //console.log(`${event} - ${id}`)
    selectTab(id)
    renderTables()
    setActionForAllRows()
    //processCheckboxes()
    window.history.pushState({ id }, ``, `/${position}`);
}



window.oninvalid = () => {
    //console.log('oninvalid')
}

window.onerror = event => {
    debugger
    console.log(`Error event - ${event}`)
}

window.onload = event => {
    //console.log(event)
    //Generate initial data for all grids
    data = genNewDataForGrid()
    renderTables()
    tabLeft.addEventListener('click', event => { push(event) })
    tabCenter.addEventListener('click', event => { push(event) })
    tabRight.addEventListener('click', event => { push(event) })
    setActionForAllRows()

    processCheckboxes()    


    // renderTable(leftdiv)
    // renderTable(centerdiv)
    // renderTable(rightdiv)
    const showLeft = event => {
        // gridcontainer.innerHTML = ''
        // gridcontainer.setAttribute('data-position', 'left')
        // window.history.pushState('', '', '/left')

        //console.log(window.location)
        //tabRight.setAttribute('class','nav-link')
        //tabCenter.setAttribute('class','nav-link')
        //tabLeft.setAttribute('class','nav-link active')
        // selecTab()
        // renderTables()
    }
    const showCenter = () => {
        // gridcontainer.innerHTML=''
        // gridcontainer.setAttribute('data-position','center')
        // window.history.pushState('','','/center')
        // //console.log(window.location)
        // tabRight.setAttribute('class','nav-link')
        // tabCenter.setAttribute('class','nav-link active')
        // tabLeft.setAttribute('class','nav-link')
        // renderTables()
    }
    const showRight = () => {
        // gridcontainer.innerHTML=''
        // gridcontainer.setAttribute('data-position','right')
        // window.history.pushState('','','/right')
        // //console.log(window.location)
        // tabRight.setAttribute('class','nav-link active')
        // tabCenter.setAttribute('class','nav-link')
        // tabLeft.setAttribute('class','nav-link')
        // renderTables()
    }
    //showLeft() //Load left data  to the botton grid on the page load event
    // tabLeft.addEventListener('click', () => 
    // {
    //     debugger
    //     const array = Array.from({length: 5}, (j, i) => genDataForGrid)
    //     window.history.pushState('','','/hello')
    //     // Change data-attribute   to center container 
    //     // renderTables()
    // })
    // tabCenter.addEventListener('click', showCenter)
    // tabRight.addEventListener('click', showRight)
}
window.genDataForGrid = genDataForGrid
window.genNewDataForGrid = genNewDataForGrid
