//mongoose models
const Project = require("../models/Project");
const Client = require("../models/Client");

//GraphQL Types
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");

//clientType
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find({ clientId: parent.id });
      }, //resolve function is used to get the data from the database
    }, //projects is a list of projects that belong to this client
  }), //fields function is used to define the fields of the clientType
});

//Project Type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId);
      },
    }, //client is the client that owns this project
  }), //fields function is used to define the fields of the projectType
}); //ProjectType

//RootQuery
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id);
      },
    },

    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find({});
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Client.findById(args.id);
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find({});
      },
    },
  },
});

//Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
      },
      resolve(parent, args) {
        let client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return client.save();
      },
    },
    // Add a project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });

        return project.save();
      },
    },
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatusUpdate",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
        },
      },
      resolve(parent, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status,
            },
          },
          { new: true }
        );
      },
    },

    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Project.findByIdAndRemove(args.id);
      },
    },
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        //remove project which belongs to this client
        Project.deleteMany({ clientId: args.id }).then(() => {
          //remove client
          Client.findByIdAndRemove(args.id).then(() => {
            return;
          });
        });
        // return Client.findByIdAndRemove(args.id);
        // Project.find({ clientId: args.id }).then((projects) => {
        //     projects.forEach((project) => {
        //       project.remove();
        //     });
        //   });

        //   return Client.findByIdAndRemove(args.id);
      },
    },
    updateClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Client.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              email: args.email,
              phone: args.phone,
            },
          },
          { new: true }
        );
      },
    },

    searchProjects: {
      type: new GraphQLList(ProjectType),
      args: {
        search: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Project.find({ name: { $regex: args.search, $options: "i" } });
      }, //resolve function is used to get the data from the database
    },
    searchClients: {
      type: new GraphQLList(ClientType),
      args: {
        search: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Client.find({ name: { $regex: args.search, $options: "i" } });
      }, //resolve function is used to get the data from the database
    },

    //agregate functions

    totalProjects: {
      type: GraphQLInt,
      resolve(parent, args) {
        return Project.countDocuments();
      },
    },
    totalClients: {
      type: GraphQLInt,
      resolve(parent, args) {
        return Client.countDocuments();
      },
    },

    //return random project from the database
    randomProject: {
      type: ProjectType,
      resolve(parent, args) {
        return Project.aggregate([{ $sample: { size: 1 } }]);
      },
    },
  },
});

//export graphql schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

// What is Aggregation in MongoDB? Aggregation is a way of processing a large number of documents in a collection by means of passing them
//  through different stages. The stages make up what is known as a pipeline. The stages in a pipeline
//  can filter, sort, group, reshape and modify documents that pass through the pipeline
