import chalk from 'chalk'

const log = (...args: any[]) => {
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
  }
}

export default logger
