const express = require("express")
const path = require("path")

const app = express()

app.use('/', express.static(path.resolve(__dirname, 'GridProjectWebFront', 'static')))

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'GridProjectWebFront', 'index.html'))
});

app.listen(process.env.PORT || 5060, () => console.log('Server running...'))


document.addEventListener('DOMContentLoaded', app.init);