import * as checks from 'src/graphql/checks'

const permissions = {
  Query: {
    portfolio: [checks.isMemberOfPortfolio()],
  },
  Mutation: {
    updatePortfolio: [checks.isPortfolioAdmin()],
    deletePortfolio: [checks.isPortfolioAdmin()],
  },
}

export default permissions
