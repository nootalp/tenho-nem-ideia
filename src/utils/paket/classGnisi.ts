import express from 'express';
import path from 'path';

const { public_Dir } = require('../config')

function index(index: string) {
    return path.join(public_Dir, index)
}

export class Gnisi {
    private route_Scope

    constructor(route_Scope: express.Router) {
        this.route_Scope = route_Scope
    }

    public upRoutes() {
        this.route_Scope
            .get("/", (req, res) => {
                res.sendFile(index('index.html'))
            })
            .get("/tuner", (req, res) => {
                res.sendFile(index('conversateInstance.html'))
            })
    }
}
