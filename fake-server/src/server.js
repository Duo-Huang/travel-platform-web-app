const express = require('express')
const { flights, flightDetails } = require('./db/flights')
const { wrapperRes } = require('./utils')

const app = express()

let count = 0

app.get('/flights', (req, res) => {
    // ---test retry---
    // count++
    // if (count < 2) {
    //     console.log(count)
    //     return res.status(500).json(wrapperRes(houseDetails))
    // }
    // console.log(count)
    // setTimeout(() => {
    //     console.log('reset')
    //     count = 0;
    //     res.status(200).json(wrapperRes(houseDetails))

    // }, 3000)
    // ---test retry---
    setTimeout(() => {
        res.status(200).json(wrapperRes(flights))
    }, 1500)
})

app.get('/flights/:id', (req, res) => {
    setTimeout(() => {
        if(req.query.cpOn) {
           return res.status(500).json({
                code: 10011,
                message: '系统内部错误',
                data: null
           })
        }
        return res.status(200).json(wrapperRes(flightDetails))
    }, 1500)
})

app.post('/rent-out-requests', (req, res) => {
    setTimeout(() => {
        res.status(500).json(postedHouseInfo)
    }, 1500)
})

app.listen(3000, () => {
    console.log('mock server is running in 3000')
})
