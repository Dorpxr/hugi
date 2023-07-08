import { BetaAnalyticsDataClient } from '@google-analytics/data'
const ENV_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS

const credential = ENV_CREDENTIALS
  ? JSON.parse(Buffer.from(ENV_CREDENTIALS, 'base64').toString())
  : {}
export const analyticsDataClient = new BetaAnalyticsDataClient({
  projectId: credential.project_id,
  credentials: {
    client_email: credential.client_email,
    private_key: credential.private_key,
  },
})
