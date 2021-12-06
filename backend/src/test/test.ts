import chai = require('chai')
import chaiHttp = require('chai-http')
import { response } from 'express';
import 'mocha';
import stockapi = require ('../stockapi')
chai.use(chaiHttp);

describe('Backend Endpoints', () =>
{
    /**
     * GET stock data by id
     */
    describe('Call stock API', () =>
    {
        it('should get real-time yahoo finance data', () =>
        {
            chai.request(stockapi);
                
        });
    });
});
