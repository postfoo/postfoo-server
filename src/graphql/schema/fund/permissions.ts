import * as checks from 'src/graphql/checks'

const permissions = {
  Mutation: {
    createFund: [checks.isSuperadmin()],
    updateFund: [checks.isSuperadmin()],
    deleteFund: [checks.isSuperadmin()],
  },
}

export default permissions
