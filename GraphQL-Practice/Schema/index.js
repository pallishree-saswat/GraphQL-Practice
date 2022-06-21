const graphql = require("graphql");
const { USER_ADD, USER_UPDATE, USER_DELETE } = require("./Mutations/User");
const { USER_LIST, USER_LIST_ONE, USER_DETAIL } = require("./Queries/User");

const { GraphQLObjectType, GraphQLSchema } = graphql;

const RootQuery = new GraphQLObjectType({
  name: "xyz",
  fields: {
    userList: USER_LIST,
    oneUser: USER_LIST_ONE,
    userDetail:USER_DETAIL
  },
});

const Mutation = new GraphQLObjectType({
  name: "mutation",
  fields: {
    userCreate : USER_ADD,
    userUpdate:USER_UPDATE,
    userDelete : USER_DELETE
  },
});

module.exports = new GraphQLSchema({ query: RootQuery ,mutation:Mutation});
