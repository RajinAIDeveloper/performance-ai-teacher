import { JWT } from 'google-auth-library';

export async function GET() {
  try {
    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    const token = await auth.getAccessToken();
    
    // Get main user data
    const usersUrl = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SPREADSHEET_ID}/values/Sheet1`;
    const usersResponse = await fetch(usersUrl, {
      headers: { 'Authorization': `Bearer ${token.token}` }
    });
    const usersData = await usersResponse.json();
    
    // Get referrals data
    const referralsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SPREADSHEET_ID}/values/Referrals`;
    const referralsResponse = await fetch(referralsUrl, {
      headers: { 'Authorization': `Bearer ${token.token}` }
    });
    
    let referralsData = { values: [] };
    if (referralsResponse.ok) {
      referralsData = await referralsResponse.json();
    }
    
    // Process users data
    let users = [];
    if (usersData.values && usersData.values.length > 1) {
      const userHeaders = usersData.values[0];
      const userRows = usersData.values.slice(1);
      
      users = userRows.map(row => {
        const user = {};
        userHeaders.forEach((header, index) => {
          user[header] = row[index] || '';
        });
        return user;
      });
    }
    
    // Process referrals data
    let referrals = [];
    if (referralsData.values && referralsData.values.length > 1) {
      const referralHeaders = referralsData.values[0];
      const referralRows = referralsData.values.slice(1);
      
      referrals = referralRows.map(row => {
        const referral = {};
        referralHeaders.forEach((header, index) => {
          referral[header] = row[index] || '';
        });
        return referral;
      });
    }
    
    return Response.json({ 
      users, 
      referrals,
      stats: {
        totalUsers: users.length,
        totalReferrals: referrals.length,
        uniqueReferrers: new Set(referrals.map(r => r.referralCode)).size
      }
    });
    
  } catch (error) {
    console.error('Referrals API error:', error);
    return Response.json({ 
      error: error.message,
      users: [],
      referrals: []
    }, { status: 500 });
  }
}