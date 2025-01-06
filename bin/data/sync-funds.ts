// To be executed in the evening as per IST
import db from 'src/db'
import { getSheetData, isValidCell, print } from './functions'

const GOOGLE_SPREADSHEET_ID = '1z6EvOx9t_J5PHBXrEGn7Qf-NQLAGQ4K0yISKkg8MmdI'

async function run() {
  if (!process.env.GOOGLE_API_KEY_FILE) {
    print('GOOGLE_API_KEY_FILE is not set')
    return
  }
  await db.$connect()
  print('Funds processing')
  try {
    const result = await getSheetData(GOOGLE_SPREADSHEET_ID)
    if (result.data.values && result.data.values.length > 1) {
      await db.$connect()
      // Remove header
      const records = result.data.values.slice(1)
      print(`Total records ${result.data.values.length}`)
      for (const i in records) {
        const name = records[i][0]
        const plan = records[i][1]
        const type = records[i][2]
        const category = records[i][4]
        const symbol = records[i][3]
        let lastNav = records[i][5]
        const description = records[i][6]
        if (isValidCell(name) && isValidCell(symbol) && isValidCell(lastNav)) {
          const exists = await db.fund.count({ where: { symbol1: symbol } })

          lastNav = Number(lastNav)
          if (exists === 0 && symbol) {
            // New record
            await db.fund.create({ data: { name, symbol1: symbol, lastNav } })
            print(`Adding ${symbol} ${name} ${lastNav}`)
          } else if (symbol) {
            // Update
            await db.fund.updateMany({ where: { symbol1: symbol }, data: { name, plan, type, category, description, lastNav } })
            print(`Updating ${symbol} ${name} ${lastNav}`)
          }
        } else {
          // Either of cell is empty
          print(`Skipping ${symbol || ''} ${name || ''} || ${lastNav || ''}`)
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
