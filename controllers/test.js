import {google} from 'googleapis';

const serviceAccountKeyFile = "./controllers/formgoogle.json";
const sheetId = '17uSo243w6dcnKtEuxfqhc5dh1OJzBfRRP_Skly5ZSZ0'
const tabName = 'Responses'
const range = 'A:G'

main().then(() => {
  console.log('Completed')
})

export async function main(mydata) {
  // Generating google sheet client
  const googleSheetClient = await _getGoogleSheetClient();

//   // Reading Google Sheet from a specific range
//   const data = await _readGoogleSheet(googleSheetClient, sheetId, tabName, range);
//   console.log(data);

  // Adding a new row to Google Sheet
  const dataToBeInserted = [mydata]
  return await _writeGoogleSheet(googleSheetClient, sheetId, tabName, range, dataToBeInserted);
  
}

async function _getGoogleSheetClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountKeyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const authClient = await auth.getClient();
  return google.sheets({
    version: 'v4',
    auth: authClient,
  });
}

async function _readGoogleSheet(googleSheetClient, sheetId, tabName, range) {
  const res = await googleSheetClient.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!${range}`,
  });

  return res.data.values;
}

async function _writeGoogleSheet(googleSheetClient, sheetId, tabName, range, data) {
  await googleSheetClient.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${tabName}!${range}`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      "majorDimension": "ROWS",
      "values": data
    },
  })
}