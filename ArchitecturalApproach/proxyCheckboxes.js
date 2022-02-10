let checkboxProxy = target => new Proxy(target, elementHandler())
const elementHandler = element => 
({
    get(element, method) 
    {
        if(method === 'push')
        {
            debugger
            console.log('push')
        }
    }
}) 

export { checkboxProxy }