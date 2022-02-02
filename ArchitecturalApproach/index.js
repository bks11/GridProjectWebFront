import { withProxy } from './proxycontainer.js'

const
    leftdiv         = withProxy(document.querySelector('#left-div')),
    centerdiv       = withProxy(document.querySelector('#center-div')),
    rightdiv        = withProxy(document.querySelector('#right-div')),

    gridcontainer   = withProxy(document.querySelector('#gridcontainer')),
    tabContainer    = document.querySelector('#pillscontainer')
    
    const renderTables = () => {
        [leftdiv, centerdiv, rightdiv, gridcontainer].forEach(t => {
            t.renderTable(t)})
    }

    const selectTab = id => {
        document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active'))
        document.querySelectorAll(`#${id}`).forEach(item => item.classList.add('active'))
    }

    const addEvents = (container, event) => {
        container.querySelectorAll('.nav-link').forEach(n => {
            n.addEventListener('click', event => { push(event) })
        })
    }
    const push = event => {
        const id = event.target.id
        const position = event.target.getAttribute('data-link')
        gridcontainer.position = position
        selectTab(id)
        renderTables()
        window.history.pushState({ id }, ``, `/${position}`);
    }
    
    window.onload = event => {
        addEvents(tabContainer, event)
        renderTables()
    }
    