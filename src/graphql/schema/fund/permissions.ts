import * as checks from 'src/graphql/checks'
import { Permissions } from 'src/types'

const permissions: Permissions = {
  Mutation: {
    createFund: [checks.isSuperadmin],
    updateFund: [checks.isSuperadmin],
    deleteFund: [checks.isSuperadmin],
  },
}

export default permissions
