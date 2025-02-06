/* eslint-disable no-console */
// To be executed in the evening as per IST
import { Exchange } from '@prisma/client'
import db from 'src/db'
import { getSheetData, isValidCell, print } from './functions'

const GOOGLE_SPREADSHEET_ID = '1hjPrMnH2LvgER9eaBAgXSMGQYs5nX9y_SxpapWIGBFc'

async function run() {
  if (!process.env.GOOGLE_API_KEY_FILE) {
    print('GOOGLE_API_KEY_FILE is not set')
    return
  }
  await db.$connect()
  print('Stocks processing')
  try {
    const result = await getSheetData(GOOGLE_SPREADSHEET_ID)
    if (result.data.values && result.data.values.length > 1) {
      await db.$connect()
      // Remove header
      const records = result.data.values.slice(1)
      print(`Total records ${result.data.values.length}`)
      for (const i in records) {
        const name = records[i][0]
        const symbolNse = records[i][1]
        const exchangeNseCode = Exchange.NSE
        const latestPriceNse = records[i][3]

        const symbolBse = records[i][4]
        const exchangeBseCode = Exchange.BOM
        const latestPriceBse = records[i][7]

        // lets try first adding NSE
        if (isValidCell(name) && isValidCell(symbolNse) && isValidCell(latestPriceNse)) {
          const exists = await db.stock.count({ where: { symbol: symbolNse, exchange: exchangeNseCode } })
          if (exists === 0) {
            await db.stock.create({ data: { name, symbol: symbolNse, lastPrice: Number(latestPriceNse), exchange: exchangeNseCode } })
            print(`Adding ${symbolNse} ${name} ${latestPriceNse}`)
          } else {
            await db.stock.updateMany({ where: { symbol: symbolNse, exchange: exchangeNseCode }, data: { name, lastPrice: Number(latestPriceNse) } })
            print(`Updating ${symbolNse} ${name} ${latestPriceNse}`)
          }
        } else {
          // Either of cell is empty
          print(`Skipping ${symbolNse || ''} ${name || ''} || ${latestPriceNse || ''}`)
        }

        // lets try adding BSE
        if (isValidCell(name) && isValidCell(symbolBse) && isValidCell(latestPriceBse)) {
          const exists = await db.stock.count({ where: { symbol: symbolBse, exchange: exchangeBseCode } })
          if (exists === 0) {
            await db.stock.create({ data: { name, symbol: symbolBse, lastPrice: Number(latestPriceBse), exchange: exchangeBseCode } })
            print(`Adding ${symbolBse} ${name} ${latestPriceBse}`)
          } else {
            await db.stock.updateMany({ where: { symbol: symbolBse, exchange: exchangeBseCode }, data: { name, lastPrice: Number(latestPriceBse) } })
            print(`Updating ${symbolBse} ${name} ${latestPriceBse}`)
          }
        } else {
          // Either of cell is empty
          print(`Skipping ${symbolBse || ''} ${name || ''} || ${latestPriceBse || ''}`)
        }
      }

      print('Import succeeded')
    } else {
      print('Import failed with no records')
    }
  } catch (err) {
    print('Import failed')
    console.log(err)
  } finally {
    await db.$disconnect()
    // Can we capture all output in a variable
    // and send email? daily report?
  }
}

run()
