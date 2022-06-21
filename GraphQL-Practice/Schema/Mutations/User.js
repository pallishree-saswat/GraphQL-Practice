const db = require("../../models");
const UserType = require("../TypeDefs/UserType");
const User = db.user;

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = require("graphql");
const StatusType = require("../TypeDefs/StatusType");


module.exports.USER_ADD = {
  type: UserType,
  args: {
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  },
  resolve(parent, args) {
    User.create({
      name: args.name,
      email: args.email,
      phone: args.phone,
    });

    return args;
  },

//   resolve: async (parent, args) {
//    await  User.create({
//       name: args.name,
//       email: args.email,
//       phone: args.phone,
//     });

//     return args;
//   },
};


module.exports.USER_UPDATE = {
  type: UserType,
  args: {
    id:{type:GraphQLInt},
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  },
  resolve: async (parent, args)  =>{
  await  User.update({
      name: args.name,
      email: args.email,
      phone: args.phone,
    },{
      where:{
        id:args.id
      }
    });

    return args;
  },


};

module.exports.USER_DELETE = {
  type: StatusType,
  args: {
    id:{type:GraphQLInt},

  },
  resolve: async (parent, args)  =>{
  await  User.destroy({
      where:{
        id:args.id
      }
    });

    return {
      success:true,
      message:"User deleted successfully",
      error:""
    };
  },


};
