export async function POST(request) {
  try {
    const { prompt, data } = await request.json();
    
    // Process data for analysis
    const analysisData = {
      totalResponses: data.length,
      demographics: {
        universities: [...new Set(data.map(d => d.university))].length,
        majors: [...new Set(data.map(d => d.major))].length,
        years: data.reduce((acc, d) => {
          acc[d.year] = (acc[d.year] || 0) + 1;
          return acc;
        }, {})
      },
      pricing: {
        free: data.filter(d => d.pricingTier?.includes('Free') || d.pricingTier?.includes('ফ্রি')).length,
        paid: data.filter(d => !d.pricingTier?.includes('Free') && !d.pricingTier?.includes('ফ্রি')).length,
        willingness: data.filter(d => d.adTolerance?.includes('Don\'t mind') || d.adTolerance?.includes('মাইনে করি না')).length
      },
      features: {
        quizInterest: data.filter(d => d.quizFrequency === 'Daily' || d.quizFrequency === 'প্রতিদিন').length,
        gamification: data.filter(d => d.gamificationInterest?.includes('interested') || d.gamificationInterest?.includes('আগ্রহী')).length,
        leaderboard: data.filter(d => d.leaderboardParticipation?.includes('interested') || d.leaderboardParticipation?.includes('আগ্রহী')).length
      },
      problems: {
        tracking: data.filter(d => d.trackingDifficulty?.includes('difficult') || d.trackingDifficulty?.includes('কঠিন')).length,
        studyHours: data.reduce((acc, d) => {
          acc[d.studyHours] = (acc[d.studyHours] || 0) + 1;
          return acc;
        }, {})
      }
    };

    // Calculate validation rates
    const validationResults = {
      problemValidation: (analysisData.problems.tracking / analysisData.totalResponses * 100).toFixed(1),
      solutionValidation: (analysisData.features.quizInterest / analysisData.totalResponses * 100).toFixed(1),
      valueValidation: (analysisData.pricing.paid / analysisData.totalResponses * 100).toFixed(1),
      gamificationValidation: (analysisData.features.gamification / analysisData.totalResponses * 100).toFixed(1),
      competitiveValidation: (analysisData.features.leaderboard / analysisData.totalResponses * 100).toFixed(1)
    };

    // Enhanced analysis prompt
    const enhancedPrompt = `
      Analyze Performance AI validation data:
      
      VALIDATION RATES:
      - Problem (tracking difficulty): ${validationResults.problemValidation}% (Target: ≥50%)
      - Solution (daily quiz interest): ${validationResults.solutionValidation}% (Target: ≥60%)
      - Value (willing to pay): ${validationResults.valueValidation}% (Target: ≥20%)
      - Gamification interest: ${validationResults.gamificationValidation}% (Target: ≥60%)
      - Competition features: ${validationResults.competitiveValidation}% (Target: ≥40%)
      
      MARKET DATA:
      - Total responses: ${analysisData.totalResponses}
      - Universities represented: ${analysisData.demographics.universities}
      - Free vs Paid preference: ${analysisData.pricing.free} vs ${analysisData.pricing.paid}
      - Ad tolerance: ${analysisData.pricing.willingness}/${analysisData.totalResponses}
      
      Provide strategic analysis covering:
      1. Hypothesis validation (pass/fail with reasoning)
      2. Market readiness assessment
      3. Feature prioritization for MVP
      4. Pricing strategy recommendations
      5. Go-to-market approach
      6. Risk mitigation strategies
      
      Format: Detailed business insights with actionable recommendations.
    `;

    // Call Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: enhancedPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const geminiResult = await geminiResponse.json();
    const analysisText = geminiResult.candidates[0].content.parts[0].text;

    // Structure the response
    const analysis = {
      validation: `${Object.values(validationResults).filter(rate => parseFloat(rate) >= 50).length}/5 hypotheses validated. Problem validation: ${validationResults.problemValidation}%, Value validation: ${validationResults.valueValidation}%, Gamification: ${validationResults.gamificationValidation}%`,
      
      insights: `Strong interest in gamification (${validationResults.gamificationValidation}%) and competitive features (${validationResults.competitiveValidation}%). ${analysisData.demographics.universities} universities represented shows market diversity. ${Math.round(analysisData.pricing.paid/analysisData.totalResponses*100)}% willing to pay indicates viable monetization.`,
      
      recommendations: `1. Prioritize gamification features for MVP (high validation). 2. Start with $5-15 pricing tier (${validationResults.valueValidation}% acceptance). 3. Focus on ${analysisData.totalResponses > 50 ? 'university partnerships' : 'individual acquisition'}. 4. Build quiz engine first (${validationResults.solutionValidation}% daily usage intent).`,
      
      risks: `Low problem validation (${validationResults.problemValidation}% vs 50% target) suggests need for better problem-solution fit. Market education required. Competition from established players.`,
      
      fullAnalysis: analysisText,
      metrics: validationResults,
      rawData: analysisData
    };

    return Response.json(analysis);

  } catch (error) {
    console.error('Gemini analysis error:', error);
    return Response.json(
      { error: 'Analysis failed', details: error.message },
      { status: 500 }
    );
  }
}