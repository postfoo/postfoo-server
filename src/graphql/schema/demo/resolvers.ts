
const resolvers = {
  Query: {
    add: async (_: any, { x, y }: { x: number; y: number }) => x + y
  }
}

export default resolvers
