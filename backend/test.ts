import chai = require('chai')
import chaiHttp = require('chai-http')
import { response } from 'express'
import 'mocha'
import server = require ('./src/controllers/ServiceController')
chai.use(chaiHttp);

describe('Backend Endpoints', () => {
    /**
     * GET stock data by id
     */
    describe('GET /stockapi/:ID', () => {
        it('should get real-time yahoo finance data', () => {
            chai.request(server)
                .get("/stockapi/:ID")
                .end((err, response) => {
                    response.should.have.status(200);
                })
        })
    })
})