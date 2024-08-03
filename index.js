const express = require('express');
const mainModule = require('./consolidater.js');
const { STATUS_SUCCESS, STATUS_INTERNAL_SERVER_ERROR, STATUS_FORBIDDEN, STATUS_NOT_FOUND } = require('./constants.js');

const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use((req, res, next) => {
    console.log(new Date(), req.url, req.method)
    next()
})
app.get('/', (req, res, next) => {
    res.send('Welcome to Excel Consolidator API');
})
app.post('/mail', (req, res, next) => {
    try {
       if(req.body){

        console.log(req.body.data);
        const jsonData = req.body.data;
        const response = mainModule.main(jsonData);
        if (response === STATUS_SUCCESS);
            res.status(STATUS_SUCCESS).send({ status: STATUS_SUCCESS, message: 'Data processed successfully' });
}

    } catch (error) {
        next(error)
    }
})
// Starting server
app.listen('8080')