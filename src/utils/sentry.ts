import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

Sentry.init({
  environment: process.env.MODE,
  dsn: process.env.SENTRY_DSN,
  release: process.env.RELEASE,
  enabled: process.env.MODE !== 'local',
  integrations: [
    nodeProfilingIntegration(),
    Sentry.httpIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
})

export default Sentry
