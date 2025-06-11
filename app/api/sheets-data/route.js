import { JWT } from 'google-auth-library';

export async function GET() {
  try {
    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    const token = await auth.getAccessToken();
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SPREADSHEET_ID}/values/Sheet1`;
    
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token.token}` }
    });
    
    const sheetData = await response.json();
    
    if (!sheetData.values || sheetData.values.length < 2) {
      return Response.json({ data: [], count: 0 });
    }

    const headers = sheetData.values[0];
    const rows = sheetData.values.slice(1);
    
    const processedData = rows.map(row => {
      const entry = {};
      headers.forEach((header, index) => {
        entry[header] = row[index] || '';
      });
      return entry;
    });

    return Response.json({ data: processedData, count: processedData.length });
    
  } catch (error) {
    console.error('Sheets data error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}