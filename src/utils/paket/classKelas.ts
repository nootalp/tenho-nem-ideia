import express from 'express';
import { getRoutes } from '../routes-func/api-routes';
import { setNote } from '../routes-func/process-note';

const logger = require('morgan');
const { public_Dir } = require('../config')

export class Kelas {
    private engines
    private router

    constructor(engines: express.Application, router: express.Router) {
        this.engines = engines
        this.router = router
    }

    public setRoutes() {
        this.config()
        this.engines
            .get("/api/routes", getRoutes)
            .post('/process-note', setNote)
    }
    
    private config() {
        this.engines
            .use(logger('dev'))
            .use(express.urlencoded({ extended: true }))
            .use(express.json())
            .use(express.static(public_Dir))
            .use('/', this.router)
    }
}