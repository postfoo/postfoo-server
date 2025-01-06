import { GoogleAuth } from 'google-auth-library'
import { google } from 'googleapis'
import moment from 'moment'

export const t = () => (moment().format('DD/MM/YYYY HH:MM:ss'))
export const print = (msg: string) => console.log(`${t()}  ${msg}`)
export const isValidCell = (value?: any) => (!(!value || value === '' || value === '#N/A'))

export const getAuth = () => {
  return new GoogleAuth({
    keyFile: process.env.GOOGLE_API_KEY_FILE,
    scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly',
  })
}

export const getSheetService = () => google.sheets({ version: 'v4', auth: getAuth() })

export const getSheetData = (spreadsheetId: string, range = 'A1:Z') => {
  return getSheetService().spreadsheets.values.get({ spreadsheetId, range })
}
