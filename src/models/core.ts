export const getId = (entity: string): string => {
  if (!entity) {
    throw 'Received empty id to fetch'
  }
  return entity
}

export const whereId = (entity: string) => {
  return { where: { id: getId(entity) } }
}
