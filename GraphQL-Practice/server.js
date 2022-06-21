const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./Schema/index");
const PORT = 3000;

const app = express();

app.use(express.json());

let db = require("./models");

let root = {
  ip: "localhost",
  dbConfig: db,
  accessKey: "abcde1234",
  //cache collection
  //anything that we will use in all files
  //and we can get all values inside parent object
};

const context = async (req) => {
  // console.log(req.headers.host);
  const host = req.headers.host
  const token = "token"
  return { host, token}
};
app.use(
  "/graphql",
  graphqlHTTP(async (req) => ({
    schema,
    rootValue: root,
    graphiql: true,
    context: () => context(req),
  }))
);

app.listen(PORT, () => {
  console.log("started server");
});
