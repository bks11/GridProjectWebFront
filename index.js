
let data = {
    left:   [],
    center: [],
    right:  []
}
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

const
    leftdiv         = document.querySelector('#left-div'),
    centerdiv       = document.querySelector('#center-div'),
    rightdiv        = document.querySelector('#right-div'),

    gridcontainer   = document.querySelector('#gridcontainer'),
    tabLeft         = document.querySelector('#tab-left'),
    tabCenter       = document.querySelector('#tab-center'),
    tabRight        = document.querySelector('#tab-right')

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
    console.log(id)
    return id
}

const setRowsAction = tblRows => { 
    //debugger
    //console.log(tblRows.length)
    for(const r of tblRows ){
        r.onclick = function() {
            rowText(this)
        }
        //console.log(r)
    }
    //tblRows.forEach(r => {console.log(r)})
    //tblRows.forEach(r => {console.log(r)}) 
}

const setActionForAllRows = () => {
    document.querySelectorAll('table').forEach(t => setRowsAction(t.rows))
}


const renderTable = container => {
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
                                        <td><input type="checkbox"/></td>
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
    template.innerHTML = `<table class="table table-bordered tabel-sm cellpadding="0">
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
    container.append(template.content.cloneNode(true))
}

const renderTables = () => {
    [leftdiv, centerdiv, rightdiv, gridcontainer].forEach(renderTable)
    //Example to learn! - [leftdiv,centerdiv, rightdiv, gridcontainer].forEach(c => renderTable(c))
}
const selectTab = id => {
    document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active'))
    console.log(`#${id}`)
    document.querySelectorAll(`#${id}`).forEach(item => item.classList.add('active'))
}

const push = event => {
    // Get id attribute of the button or link clicked
    const id = event.target.id
    console.log(`ID = ${id}`)
    console.log(event.target)
    const position = event.target.getAttribute('data-link')
    gridcontainer.innerHTML = ''
    gridcontainer.setAttribute('data-position', position)
    console.log(`${event} - ${id}`)
    selectTab(id)
    renderTables()
    setActionForAllRows()
    window.history.pushState({ id }, ``, `/${position}`);
}

import { genDataForGrid, genNewDataForGrid } from './dataproc.js'

window.oninvalid = () => {
    console.log('oninvalid')
}

window.onerror = event => {
    debugger
    console.log(`Error event - ${event}`)
}
window.onload = event => {
    console.log(event)
    //Generate initial data for all grids
    data = genNewDataForGrid()
    renderTables()
    tabLeft.addEventListener('click', event => { push(event) })
    tabCenter.addEventListener('click', event => { push(event) })
    tabRight.addEventListener('click', event => { push(event) })
    setActionForAllRows()



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
