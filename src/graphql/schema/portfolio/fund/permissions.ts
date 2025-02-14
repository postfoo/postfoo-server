import * as checks from 'src/graphql/checks'

const permissions = {
  Query: {
    portfolioFund: [checks.isMemberOfPortfolioFund()],
    portfolioFunds: [checks.isMemberOfPortfolio()],
  },
  Mutation: {
    createPortfolioFund: [checks.isMemberOfPortfolio()],
    updatePortfolioFund: [checks.isPortfolioFundAdmin()],
    deletePortfolioFund: [checks.isPortfolioFundAdmin()],
  },
}

export default permissions
