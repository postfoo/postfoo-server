import * as checks from 'src/graphql/checks'

const permissions = {
  Query: {
    portfolioStock: [checks.isMemberOfPortfolioStock()],
    portfolioStocks: [checks.isMemberOfPortfolio()],
  },
  Mutation: {
    createPortfolioStock: [checks.isMemberOfPortfolio()],
    updatePortfolioStock: [checks.isMemberOfPortfolioStock(), checks.isPortfolioStockAdmin()],
    deletePortfolioStock: [checks.isMemberOfPortfolioStock(), checks.isPortfolioStockAdmin()],
  },
}

export default permissions
