import * as checks from 'src/graphql/checks'
import { Permissions } from 'src/types'

const permissions: Permissions = {
  User: {
    // Except users ID, everthing else is private or superadmin only
    mobile: [checks.isMe],
    firstName: [checks.isMe],
    lastName: [checks.isMe],
    name: [checks.isMe],
    token: [checks.isMe],
    isVerified: [checks.isMe],
    isBlocked: [checks.isMe],
    status: [checks.isMe],
    // codes, salt & password are not exposed, so we throw errors if requested
    salt: [checks.isNotAvailable],
    password: [checks.isNotAvailable],
    codes: [checks.isNotAvailable],
  },
}

export default permissions
