import db from 'src/db'
import * as model from 'src/models'
import { Resolvers } from 'src/types/resolvers'
import * as errors from 'src/utils/errors'

const resolvers: Resolvers = {
  Query: {
    field: async (_, args, _ctx) => {
      return await model.field.get(args.fieldId)
    },
    fields: async (_, args, _ctx) => {
      const { name, portfolioId } = args.input || {}
      return await model.field.find(portfolioId, name)
    },
  },
  Mutation: {
    createField: async(_, args, _ctx) => {
      const { name, value, portfolioId } = args.input
      const count = await db.field.count({ where: { portfolioId } })
      if (count >= 200) {
        // 200 fieles is fair usage for now. Above it we can by pass for partiular users on this basis we understand the usage.
        throw errors.invalidInput('general', 'You have reached the maximum number of fields allowed. Please email admin@postfoo.com to increase your limit.')
      }
      return db.field.create({ data: { name, value, portfolioId } })
    },
    updateField: async(_, args, _ctx) => {
      const { name, value, fieldId } = args.input
      // Check if the field exists
      await model.field.get(fieldId)
      return db.field.update({ where: { id: fieldId }, data: { name, value } })
    },
    deleteField: async(_, args, _ctx) => {
      const { fieldId } = args.input
      // Check if the field exists
      await model.field.get(fieldId)
      await db.field.delete({ where: { id: fieldId } })
      return {}
    },
  },
}

export default resolvers
