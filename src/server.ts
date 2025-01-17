import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

class App{
    private app: express.Application
    private http: http.Server
    private io: Server
    
    constructor(){
        this.app = express()
        this.http = http.createServer(this.app)
        this.io = new Server(this.http)
    }
    listenServer(){

    }
}

const app = new App()

app.listenServer()