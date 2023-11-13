// 1.import packages
import express from 'express'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'

import 'dotenv/config'


// 2.use packages
const app = express()
app.use(cors())
app.use(express.json())

const client = new MongoClient(process.env.MONGO_URI as string)
const db = client.db('dino-store')
const users = db.collection('users')



client.connect()
console.log('Connected to Mongo')


// 3.listen port 
app.listen(process.env.PORT, () => console.log('Api listening here😁'))

// 4. create a get endpoint
app.get('/', async (req, res) => {
    const allUsers = await users.find().toArray()
	res.send(allUsers)
})

// 5. create endpoint to add users
app.post('/', async (req, res) => {
    const hashPass = await bcrypt.hash(req.body.password, 10)
	const userAdded = await users.insertOne(req.body)
	res.send(userAdded)

})

// 6. create delete endpoint by email with params

app.delete('/:_id', async (req, res) => {
    const cleanId = new ObjectId(req.params._id)
   console.log ('req.params ->', req.params) // { _id: '65529206377290464ff89340'}
    const userDeleted = await users.findOneAndDelete({ _id: cleanId })
    res.send(userDeleted)
})


// 7. create a patch endpoint by email with params
app.patch('/:_id', async (req, res) => {
    // console.log ('req.params ->', req.params)
    const updatedId= new ObjectId(req.params._id)
     const itemUpdated = await users.findOneAndUpdate({ _id: updatedId },{ $set: req.body} )
    //   ({ email: req.params.email }, { $set: req.body})
    res.send(itemUpdated)
})

// 8. login endpoint
app.post('/login', async (req, res) => {
    const userPassword = req.body.password
    const foundUser = await users.findOne({ email: req.body.email})


    if ( foundUser) {
        const passInDd = foundUser?.passsword
        const result = await bcrypt.compare(userPassword, passInDd)
        console.log('result -> ', result)
        res.send(foundUser)
    } else{
        res.json('user not found !!!❌')
    }

})