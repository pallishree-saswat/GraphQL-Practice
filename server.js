const express = require('express')
const {graphqlHTTP} = require("express-graphql")
const schema = require('./schema')
const PORT = 3000

const app = express()

app.use(express.json())

app.use('/graphql', graphqlHTTP({schema, graphiql:true}))


app.listen(PORT, () => {
    console.log('started server')
})