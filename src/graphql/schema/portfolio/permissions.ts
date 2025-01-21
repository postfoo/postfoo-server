import * as checks from 'src/graphql/checks'

const permissions = {
  Query: {
    portfolio: [checks.isMemberOfPortfolio()],
  },
  Mutation: {
    updatePortfolio: [checks.isMemberOfPortfolio(), checks.isPortfolioAdmin()],
    deletePortfolio: [checks.isMemberOfPortfolio(), checks.isPortfolioAdmin()],
  },
}

export default permissions
