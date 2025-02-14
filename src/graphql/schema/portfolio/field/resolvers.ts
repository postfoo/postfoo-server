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
    createField: async(_, args, ctx) => {
      const { name, value, portfolioId } = args.input

      const count = await db.field.count({ where: { portfolioId } })
      if (count >= 200) {
        // In general do not allow more than 200 fields. TODO:: Revisit later to increase this depending on the
        // how many custom fields are needed.
        throw errors.invalidInput('general', 'You have reached the maximum number of fields allowed. Please contact support to increase your limit.')
      }

      const countByName = await db.field.count({ where: { portfolioId, name } })
      const activeSubscription = await model.user.activeSubscription(ctx.user.id)
      if (countByName >= activeSubscription.schemes) {
        throw errors.invalidInput('general', `You have reached the maximum number of allowed ${name} fields in your plan.`)
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
