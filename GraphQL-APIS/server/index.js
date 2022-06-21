const express = require("express");
const colors = require("colors");
require("dotenv").config();
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const port = process.env.PORT || 5000;
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
// Connect to database
connectDB();

app.use(cors());

//graphqlHTTP is a function that takes in a bunch of options and returns a middleware function that
// can be used to handle GraphQL requests.
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
