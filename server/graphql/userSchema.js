var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLBoolean = require('graphql').GraphQLBoolean;
var GraphQLDate = require('graphql-date');
var UserModel = require('../models/User');


var userType = new GraphQLObjectType({
  name: 'user',
  fields: function () {
    return {
      _id: {
        type: GraphQLString
      },
      username: {
        type: GraphQLString
      },
      phone_number: {
        type: GraphQLString
      },
      country_code: { type: GraphQLString },
      authyId: { type: GraphQLString },
      phone_verified: {
        type: GraphQLBoolean
      },
      updated_date: {
        type: GraphQLDate
      }
    }
  }
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      users: {
        type: new GraphQLList(userType),
        resolve: function () {
          const users = UserModel.find().exec()
          if (!users) {
            throw new Error('Error')
          }
          return users
        }
      },
      user: {
        type: userType,
        args: {
          id: {
            name: '_id',
            type: GraphQLString
          }
        },
        resolve: function (root, params) {
          const userDetails = UserModel.findById(params.id).exec()
          if (!userDetails) {
            throw new Error('Error')
          }
          return userDetails
        }
      }
    }
  }
});

var mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function () {
    return {
      addUser: {
        type: userType,
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          },
          phone_number: {
            type: new GraphQLNonNull(GraphQLString)
          },
          phone_verified: {
            type: new GraphQLNonNull(GraphQLBoolean)
          }
        },
        resolve: function (root, params) {
          const userModel = new UserModel(params);
          const newUser = userModel.save();
          if (!newUser) {
            throw new Error('Error');
          }
          return newUser
        }
      },
      updateUser: {
        type: userType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          },
          username: {
            type: new GraphQLNonNull(GraphQLString)
          },
          phone_number: {
            type: new GraphQLNonNull(GraphQLString)
          },
          phone_verified: {
            type: new GraphQLNonNull(GraphQLBoolean)
          }
        },
        resolve(root, params) {
          return UserModel.findByIdAndUpdate(params.id, { username: params.username, phone_number: params.phone_number, phone_verified: params.phone_verified, updated_date: new Date() }, function (err) {
            if (err) return next(err);
          });
        }
      },
      removeUser: {
        type: userType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, params) {
          const remUser = UserModel.findByIdAndRemove(params.id).exec();
          if (!remUser) {
            throw new Error('Error')
          }
          return remUser;
        }
      }
    }
  }
});

module.exports = new GraphQLSchema({'query': queryType, 'mutation': mutation});
