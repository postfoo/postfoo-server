import * as checks from 'src/graphql/checks'
import { Permissions } from 'src/types'

const permissions: Permissions = {
  Query: {
    portfolioFund: [checks.isMemberOfPortfolioFund],
    portfolioFunds: [checks.isMemberOfPortfolio],
  },
  Mutation: {
    createPortfolioFund: [checks.isMemberOfPortfolio],
    updatePortfolioFund: [checks.isMemberOfPortfolioFund, checks.isPortfolioFundAdmin],
    deletePortfolioFund: [checks.isMemberOfPortfolioFund, checks.isPortfolioFundAdmin],
  },
}

export default permissions
