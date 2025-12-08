import { gql } from "graphql-tag";

export function buildTypeDefsAndResolvers(schemaObj) {
  const typeDefs = gql`
    type JSON
    type Note { id: String, title: String, location: String, datetime: String, temp_c: Float, wind_kph: Float, precip_mm: Float, createdAt: String, owner: String }
    type Computed { feels_c: Float, clothing: String, walk: String }
    type Points { earned: Int, base: Int, dailyBonus: Int, special: JSON, total: Int }
    type CreateNoteResult { note: Note, computed: Computed, points: Points, special: JSON }
    type DailySpecial { day: Int, points: Int, message: String }
    type Query {
      me: JSON
      listNotes: [Note]
      points: JSON
      dailySpecials: [DailySpecial]
    }
    type Mutation {
      register(username: String!, password: String!): JSON
      login(username: String!, password: String!): JSON
      createNote(title: String!, location: String!, datetime: String!, temp: Float!, unit: String!, wind_kph: Float, precip_mm: Float): CreateNoteResult
      updateNote(id: String!, title: String, location: String, datetime: String, temp: Float, unit: String, wind_kph: Float, precip_mm: Float): JSON
      deleteNote(id: String!): JSON
    }
  `;

  const resolvers = {
    Query: {},
    Mutation: {}
  };

  for (const key of Object.keys(schemaObj)) {
    if (["me", "listNotes", "points", "dailySpecials"].includes(key)) {
      resolvers.Query[key] = async (parent, args, context) => {
        return await schemaObj[key].resolve({ ...args, ctx: context.req });
      };
    } else {
      resolvers.Mutation[key] = async (parent, args, context) => {
        return await schemaObj[key].resolve({ ...args, ctx: context.req });
      };
    }
  }

  return { typeDefs, resolvers };
}
