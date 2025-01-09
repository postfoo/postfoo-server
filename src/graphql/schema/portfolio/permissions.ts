import * as checks from 'src/graphql/checks'
import { Permissions } from 'src/types'

const permissions: Permissions = {
  Query: {
    portfolio: [checks.isMemberOfPortfolio],
  },
  Mutation: {
    updatePortfolio: [checks.isMemberOfPortfolio, checks.isPortfolioAdmin],
    deletePortfolio: [checks.isMemberOfPortfolio, checks.isPortfolioAdmin],
  },
}

export default permissions
