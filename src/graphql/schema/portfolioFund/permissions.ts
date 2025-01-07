import * as checks from 'src/graphql/checks'
import { Permissions } from 'src/types'

const permissions: Permissions = {
  Query: {
    portfolioFund: [checks.isMemberOfPortfolioFund],
    portfolioFunds: [checks.isMemberOfPortfolio],
  },
  Mutation: {
    createPortfolioFund: [checks.isMemberOfPortfolio],
    updatePortfolioFund: [checks.isMemberOfPortfolioFund],
    deletePortfolioFund: [checks.isMemberOfPortfolioFund],
  },
}

export default permissions
