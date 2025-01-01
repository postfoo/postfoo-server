import os from 'os'
import sendpulse from 'sendpulse-api'
import logger from 'src/utils/logger'

export const SENDER_NAME = 'RAVINIAPP'

const tokenStorage = os.tmpdir()

const initSendpulse = () => {
  return new Promise((resolve, _reject) => {
    sendpulse.init(process.env.SEND_PULSE_API_USER_ID, process.env.SEND_PULSE_API_USER_SECRET, tokenStorage, () => {
      resolve(undefined)
    })
  })
}

const sendSmsViaSendpulse = (recipient: string, message: string) => {
  return new Promise((resolve, _reject) => {
    sendpulse.smsSend(
      // TODO: handle error and success
      () => { resolve(undefined) },
      SENDER_NAME,
      [recipient],
      message,
      undefined,
      undefined,
      undefined,
    )
  })
}

export const sms = async (recipient: string, message: string) => {
  if (process.env.MODE === 'local') {
    logger.info(`To ${recipient}, Message: ${message}`)
  } else {
    await initSendpulse()
    await sendSmsViaSendpulse(recipient, message)
  }
}
