const express = require('express')
const { flights, flightDetails } = require('./db/flights')
const { flightOrderDetails }  = require('./db/orders')
const { corpPayApprovers, corpPayProjects }  = require('./db/clientManagement')
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
        if(req.query.cpOn && JSON.parse(req.query.cpOn)) {
           return res.status(500).json({
                code: 10011,
                message: '系统内部错误',
                data: null
           })
        }
        return res.status(200).json(wrapperRes(flightDetails))
    }, 1500)
})

app.get('/flights-orders/:orderId', (req, res) => {
    setTimeout(() => {
        if(req.query.orderDue && JSON.parse(req.query.orderDue)) {
           return res.status(499).json({
                code: 20221,
                message: '订单失效',
                data: null
           })
        }
        return res.status(200).json(wrapperRes(flightOrderDetails))
    }, 1500)
})

app.get('/corporate-payment/approvers', (req, res) => {
    setTimeout(() => {
        res.status(200).json(wrapperRes(corpPayApprovers))
    }, 1500)
})

app.get('/corporate-payment/projects', (req, res) => {
    setTimeout(() => {
        if(req.query.apOn && JSON.parse(req.query.apOn)) {
            return res.status(500).json({
                 code: 11011,
                 message: '系统内部错误',
                 data: null
            })
         }
         return res.status(200).json(wrapperRes(corpPayProjects))
    }, 1500)
})

app.post('/flights-orders/:orderId/coporate-payment-approval', (req, res) => {
    setTimeout(() => {
        res.status(200).json(req.body)
    }, 1500)
})

app.listen(3000, () => {
    console.log('mock server is running in 3000')
})
