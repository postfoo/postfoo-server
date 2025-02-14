import * as checks from 'src/graphql/checks'

const permissions = {
  Query: {
    field: [checks.isMemberOfPortfolioField()],
    fields: [checks.isMemberOfPortfolio()],
  },
  Mutation: {
    createField: [checks.isMemberOfPortfolio()],
    updateField: [checks.isMemberOfPortfolioField(), checks.isPortfolioFieldAdmin()],
    deleteField: [checks.isMemberOfPortfolioField(), checks.isPortfolioFieldAdmin()],
  },
}

export default permissions
