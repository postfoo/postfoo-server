import '@fastify/request-context'
import { User } from '@prisma/client'
import { Jwt } from 'src/utils/jwt'

declare module '@fastify/request-context' {
  interface RequestContextData {
    token?: string | null,
    user?: User | null,
    jwt?: Jwt | null,
  }
}
