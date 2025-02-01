import * as checks from 'src/graphql/checks'

const permissions = {
  Mutation: {
    createStock: [checks.isSuperadmin()],
    updateStock: [checks.isSuperadmin()],
    deleteStock: [checks.isSuperadmin()],
  },
}

export default permissions
