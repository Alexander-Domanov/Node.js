import express, {Request, Response} from 'express'

const app = express()
const port = 5050

app.get('/', (req: Request, res: Response) => {

    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`The server is listening on port ${port} now`)
})