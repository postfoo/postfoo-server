import { GraphQLScalarType } from 'graphql'
import { BigIntResolver, DateResolver, DateTimeResolver, EmailAddressResolver, JSONObjectResolver, JSONResolver, JWTResolver, NonEmptyStringResolver, PhoneNumberResolver, URLResolver, VoidResolver } from 'graphql-scalars'
import { Resolvers } from 'src/types/resolvers'
import { URL } from 'url'


const extendScalar = (scalar: GraphQLScalarType, handler: (val: any) => any) => {
  return {
    ...scalar,
    parseValue: (value: any) => handler(scalar.parseValue(value)),
    parseLiteral: (...args) => handler(scalar.parseLiteral(...args)),
  } as GraphQLScalarType
}

const dateResolver = extendScalar(DateResolver, (date: Date) => date.toISOString())
const dateTimeResolver = extendScalar(DateTimeResolver, (date: Date) => date.toISOString())

export const resolvers: Resolvers = {
  Date: dateResolver,
  DateTime: dateTimeResolver,
  BigInt: BigIntResolver,
  Void: VoidResolver,
  NonEmptyString: NonEmptyStringResolver,
  EmailAddress: extendScalar(EmailAddressResolver, (email) => {
    return email ? email.toLowerCase() : email
  }),
  JWT: JWTResolver,
  URL: extendScalar(URLResolver, (url: URL) => url.href),
  PhoneNumber: PhoneNumberResolver,
  ['ID' as any]: NonEmptyStringResolver,
  Json: JSONResolver,
  JsonObject: JSONObjectResolver,
}

// Otherwise it uses the name of the scalar e.g. `NonEmptyStringResolver`
for (const name in resolvers) {
  (resolvers as any)[name].name = name
}

export default resolvers
