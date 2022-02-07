import { withProxy } from './proxycontainer.js'

const tabs = {
    left : document.querySelector('a[data-link="left"]'), 
    center : document.querySelector('a[data-link="center"]'),
    right : document.querySelector('a[data-link="right"]') 
}

const
    leftdiv         = withProxy(document.querySelector('#left-div')),
    centerdiv       = withProxy(document.querySelector('#center-div')),
    rightdiv        = withProxy(document.querySelector('#right-div')),

    gridcontainer   = withProxy(document.querySelector('#gridcontainer'), tabs)
    
    const renderTables = () => {
        leftdiv.setAttribute('data-position', 'left')
        centerdiv.setAttribute('data-position', 'center')
        rightdiv.setAttribute('data-position', 'right')
        gridcontainer.setAttribute('data-position', 'left') 
    }

    const addEvents = () => {
        for (let tab in tabs ) 
        {
            tabs[tab].addEventListener('click', push)
        }
    }
    const push = event => {
        const id = event.target.id
        const position = event.target.getAttribute('data-link')
        gridcontainer.setAttribute('data-position', position)
        window.history.pushState({ id }, ``, `/${position}`);
    }
    
    window.onload = event => {
        addEvents(event)
        renderTables()
    }
    