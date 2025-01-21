import * as checks from 'src/graphql/checks'

const permissions = {
  Query: {
    portfolioFund: [checks.isMemberOfPortfolioFund()],
    portfolioFunds: [checks.isMemberOfPortfolio()],
  },
  Mutation: {
    createPortfolioFund: [checks.isMemberOfPortfolio()],
    updatePortfolioFund: [checks.isMemberOfPortfolioFund(), checks.isPortfolioFundAdmin()],
    deletePortfolioFund: [checks.isMemberOfPortfolioFund(), checks.isPortfolioFundAdmin()],
  },
}

export default permissions
