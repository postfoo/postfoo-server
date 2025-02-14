import * as checks from 'src/graphql/checks'

const permissions = {
  Query: {
    portfolioStock: [checks.isMemberOfPortfolioStock()],
    portfolioStocks: [checks.isMemberOfPortfolio()],
  },
  Mutation: {
    createPortfolioStock: [checks.isPortfolioAdmin()],
    updatePortfolioStock: [checks.isPortfolioStockAdmin()],
    deletePortfolioStock: [checks.isPortfolioStockAdmin()],
  },
}

export default permissions
