import chalk from 'chalk'
import sentry from 'src/utils/sentry'

const log = (...args: any[]) => {
  // eslint-disable-next-line no-console
  console.log(args.join(' '))
}

const logger = {
  debug: (message: string) => {
    log('[DEBUG]', chalk.grey(message))
  },
  warn: (message: string) => {
    log('[WARN]', chalk.yellow(message))
  },
  info: (message: string) => {
    log('[INFO]', chalk.green(message))
  },
  error: (message: string) => {
    log('[ERROR]', chalk.red(message))

    const err = new Error(message)
    sentry.captureException(err, {
      extra: { message },
    })
    err.message = message
  }
}

export default logger
