import { gql } from "apollo-server";

export const typeDefs = gql`
  type Note {
    id: ID!
    title: String!
    location: String!
    datetime: String!
    tempC: Float!
    feelsLikeC: Float!
    wind: Float
    precip: Float
  }

  type Feedback {
    points: Int!
    advice: String!
    reward: String
  }

  type User {
    username: String!
    points: Int!
    notes: [Note!]!
  }

  type Query {
    me(username: String!): User
  }

  type Mutation {
    signup(username: String!, password: String!): User
    login(username: String!, password: String!): User

    addNote(
      username: String!
      title: String!
      location: String!
      datetime: String!
      temp: Float!
      unit: String!
      wind: Float
      precip: Float
    ): Feedback
  }
`;
