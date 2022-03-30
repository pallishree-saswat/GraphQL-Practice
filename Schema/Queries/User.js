const db = require("../../models");
const UserType = require("../TypeDefs/UserType");
const User = db.user;
const graphql = require("graphql");
const { GraphQLList } = graphql;

module.exports.USER_LIST = {
  type: GraphQLList(UserType),
  resolve: async (parent, args, context) => {
    //parent will give all rootvalue
    // console.log(parent);
    let mydata = await context();
    console.log(mydata);
    let { dbConfig } = parent;
    let data = dbConfig.user.findAll({});

    return data;
  },
};

module.exports.USER_LIST_ONE = {
  type: GraphQLList(UserType),
  resolve(parent, args) {
    let data = User.findAll({ where: { id: 1} });

    return data;
  },
};

module.exports.USER_DETAIL = {
  type: GraphQLList(UserType),
  args:{
     id:{type:graphql.GraphQLInt}
  },
  resolve(parent, args) {
    let data = User.findAll({ where: { id: args.id } });

    return data;
  },
};
