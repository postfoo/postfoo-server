import { DurationInputObject } from "moment"
import { getId } from "src/models/core"
import { User } from "src/types"
import * as jwt from "src/utils/jwt"

export const sessionToken = (user: Pick<User, 'id'> & any, duration?: DurationInputObject, extra?: Partial<jwt.Jwt>): Promise<string> => {
  return jwt.sign({ ...extra, sub: getId(user), aud: jwt.Audience.Session }, duration)
}
