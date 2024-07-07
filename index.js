import express from 'express'
import authRouter from './routes/authRouter.js'
import orgRouter from './routes/orgRouter.js'
import { dbMiddleWare } from './postgressDB/connectDB.js'

export const app = express()

app.get('/', (req, res) => {
  res.send('Hello task 2');
});

// app.use(dbMiddleWare)
app.use(express.json())

const authPath = '/auth'
app.use(authPath, authRouter)

const orgPath = '/api'
app.use(orgPath, orgRouter)

