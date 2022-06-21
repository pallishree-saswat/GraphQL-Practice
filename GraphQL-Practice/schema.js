const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = graphql;

const db = require("./models");
const User = db.user;

const UserType = new GraphQLObjectType({
  name: "user",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLInt },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "xyz",
  fields: {
    graphQlQry: {
      type: GraphQLList(UserType),
      resolve(parent, args) {
        let data = [
          {
            id: 1,
            name: "demo",
            email: "demo",
            phone: 12457896,
          },
          {
            id: 2,
            name: "demo2",
            email: "demo2",
            phone: 654321,
          },
        ];

        return data;
      },
    },

    userList: {
      type: GraphQLList(UserType),
      resolve(parent, args) {
        let data = User.findAll({});

        return data;
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery });
