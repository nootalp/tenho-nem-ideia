import express from 'express';


export class Setting {
    private app
    private http_Host
    private http_Port

    constructor(http_Host: string, http_Port: number, app: express.Application) {
        this.app = app
        this.http_Host = http_Host
        this.http_Port = http_Port
    }

    public stepLog() {
        this.app.listen(this.http_Port, () => {
            console.log(`Server is running on http://${this.http_Host}:${this.http_Port}/tuner`)
        })
    }

}