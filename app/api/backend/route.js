const headers = [
  'timestamp', 'language', 'name', 'email', 'phone', 'university', 'major', 'year',
  'currentGPA', 'trackingDifficulty', 'studyHours', 'quizFrequency', 'tutorUsage',
  'cvImportance', 'pricingTier', 'customPrice', 'adTolerance', 'trialInterest',
  'referralReward', 'preferredReward', 'preferredFeatures', 'gamificationInterest',
  'competitiveFeatures', 'deviceUsage', 'universityType', 'studyMethod',
  'sessionLength', 'aiExplanationImportance', 'referralLikelihood', 'referralSource',
  'leaderboardParticipation', 'studyStreakImportance', 'badgeMotivation', 
  'referralId', 'userReferralCode'
];

export async function POST(request) {
  try {
    const formData = await request.json();
    
    // Generate unique referral code for this user
    const userReferralCode = 'PA-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    
    // Use Google Sheets API directly
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SPREADSHEET_ID}/values/Sheet1:append?valueInputOption=RAW`;
    
    // Get access token
    const { JWT } = await import('google-auth-library');
    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    const token = await auth.getAccessToken();
    
    // Check if sheet has data
    const checkUrl = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SPREADSHEET_ID}/values/Sheet1`;
    const checkResponse = await fetch(checkUrl, {
      headers: { 'Authorization': `Bearer ${token.token}` }
    });
    const checkData = await checkResponse.json();
    
    // Prepare values
    const values = [];
    
    // Add headers if sheet is empty
    if (!checkData.values || checkData.values.length === 0) {
      values.push(headers);
    }
    
    // Add form data with generated referral code
    const dataRow = headers.map(header => {
      if (header === 'userReferralCode') return userReferralCode;
      return formData[header] || '';
    });
    values.push(dataRow);
    
    // Append to sheet
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    // If user used a referral code, track in referrals sheet
    if (formData.referralId) {
      await trackReferral(formData.referralId, {
        referredName: formData.name,
        referredEmail: formData.email,
        referredPhone: formData.phone,
        timestamp: new Date().toISOString()
      }, token.token);
    }
    
    console.log(`✅ Data saved for: ${formData.email} | Referral Code: ${userReferralCode}`);
    
    return Response.json({ 
      success: true, 
      message: 'Data saved successfully',
      referralCode: userReferralCode
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

async function trackReferral(referralId, referredData, token) {
  try {
    const referralUrl = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SPREADSHEET_ID}/values/Referrals:append?valueInputOption=RAW`;
    
    // Check if referrals sheet exists
    const checkUrl = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SPREADSHEET_ID}/values/Referrals`;
    const checkResponse = await fetch(checkUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const referralHeaders = ['timestamp', 'referralCode', 'referredName', 'referredEmail', 'referredPhone'];
    const values = [];
    
    if (!checkResponse.ok || !await checkResponse.json().values) {
      values.push(referralHeaders);
    }
    
    values.push([
      referredData.timestamp,
      referralId,
      referredData.referredName,
      referredData.referredEmail,
      referredData.referredPhone
    ]);
    
    await fetch(referralUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values })
    });
    
    console.log(`✅ Referral tracked: ${referralId} → ${referredData.referredName}`);
  } catch (error) {
    console.error('❌ Referral tracking error:', error);
  }
}

export async function GET() {
  try {
    const { JWT } = await import('google-auth-library');
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
    
    const data = await response.json();
    const count = data.values ? data.values.length - 1 : 0; // Subtract header row
    
    return Response.json({ count: Math.max(0, count), exists: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}