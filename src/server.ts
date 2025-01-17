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
        this.listenSocket()
        this.setRoutes()
    }
    listenServer(){
        this.http.listen(80, () => { console.log('Server running on port 80') })
    }
    listenSocket(){
        this.io.on('connection', (socket) => {
            console.log('User => ', socket.id)

            socket.on('chat', (msg) => {
                console.log('Chat => ', msg)
                this.io.emit('chat', msg)
            })

            socket.on('disconnect', () => {
                console.log('User disconnected')
            })
        })
    }
    setRoutes(){
        this.app.use(express.static('public'))
        this.app.get('/', (req, res) => {
            res.sendFile('index.html', { root: 'site' })
        })
    }
}

const app = new App()

app.listenServer()
