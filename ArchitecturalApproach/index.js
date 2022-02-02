import { withProxy } from './proxycontainer.js'

const
    leftdiv         = withProxy(document.querySelector('#left-div')),
    centerdiv       = withProxy(document.querySelector('#center-div')),
    rightdiv        = withProxy(document.querySelector('#right-div')),

    gridcontainer   = withProxy(document.querySelector('#gridcontainer')),
    tabContainer    = document.querySelector('#pillscontainer')
    
    const renderTables = () => {
        leftdiv.setAttribute('data-position', 'left')
        centerdiv.setAttribute('data-position', 'center')
        rightdiv.setAttribute('data-position', 'right')
        gridcontainer.setAttribute('data-position', 'left')
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
        
        gridcontainer.setAttribute('data-position', position) //property
        selectTab(id)
        
        window.history.pushState({ id }, ``, `/${position}`);
    }
    
    window.onload = event => {
        addEvents(tabContainer, event)
        renderTables()
    }
    