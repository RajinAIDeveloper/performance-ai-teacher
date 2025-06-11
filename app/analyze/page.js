'use client'
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Brain, TrendingUp, Users, Target, Star, CheckCircle, AlertCircle, Loader, Download, ArrowLeft, Shield } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

const AnalyzePage = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [waitlistCount, setWaitlistCount] = useState(0);

  const isAdmin = isSignedIn && user?.emailAddresses?.[0]?.emailAddress === 'ultrotech1236@gmail.com';

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/80 mb-6">
            You are not authorized to access this page. This section is restricted to administrators only.
          </p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Hypothesis categories with thresholds
  const hypotheses = {
    problem: {
      title: "Problem Hypotheses",
      tests: [
        { key: "trackingDifficulty", threshold: "≥50% report difficulty", target: 50 },
        { key: "tutorUsage", threshold: "≥40% need 2+ hrs/week", target: 40 }
      ]
    },
    solution: {
      title: "Solution Hypotheses", 
      tests: [
        { key: "quizFrequency", threshold: "≥4 days/week engagement", target: 60 },
        { key: "cvImportance", threshold: "≥4/5 rating usefulness", target: 70 }
      ]
    },
    value: {
      title: "Value Hypotheses",
      tests: [
        { key: "pricingTier", threshold: "≥20% willing to pay", target: 20 },
        { key: "trialInterest", threshold: "≥15% premium upgrade", target: 15 }
      ]
    },
    growth: {
      title: "Growth Hypotheses",
      tests: [
        { key: "referralLikelihood", threshold: "≥5% refer within 30 days", target: 5 },
        { key: "universityType", threshold: "≥200 sign-ups per institution", target: 200 }
      ]
    },
    gamification: {
      title: "Gamification Hypotheses",
      tests: [
        { key: "gamificationInterest", threshold: "≥60% interested in badges/points", target: 60 },
        { key: "leaderboardParticipation", threshold: "≥40% want competitions", target: 40 }
      ]
    }
  };

  const fetchWaitlistData = async () => {
    try {
      const response = await fetch('/api/backend');
      const result = await response.json();
      setWaitlistCount(result.count);
    } catch (error) {
      console.error('Error fetching waitlist:', error);
    }
  };

  const fetchAndAnalyzeData = async () => {
    setLoading(true);
    try {
      // Fetch data from server-side API
      const response = await fetch('/api/sheets-data');
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      if (!result.data || result.data.length === 0) {
        throw new Error('No data available for analysis');
      }

      setData(result.data);

      // Call Gemini API for analysis
      const analysisPrompt = `
        Analyze this student feedback data for Performance AI app validation:
        
        Total responses: ${result.data.length}
        Sample data: ${JSON.stringify(result.data.slice(0, 5))}
        
        Test these hypotheses:
        1. Problem: ≥50% struggle with academic tracking
        2. Solution: ≥60% want daily AI quizzes  
        3. Value: ≥20% willing to pay $5-15/month
        4. Growth: ≥40% likely to refer friends
        5. Gamification: ≥60% interested in competitive features
        
        Provide detailed analysis with:
        - Validation status for each hypothesis
        - Key insights and trends
        - Feature prioritization recommendations
        - Market entry strategy
        - Risk assessment
      `;

      const geminiResponse = await fetch('/api/gemini-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: analysisPrompt, data: result.data })
      });

      const geminiResult = await geminiResponse.json();
      setAnalysis(geminiResult);

    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlistData();
  }, []);

  const calculateHypothesisResults = () => {
    if (!data) return {};
    
    const results = {};
    
    Object.entries(hypotheses).forEach(([category, info]) => {
      results[category] = info.tests.map(test => {
        let passRate = 0;
        let total = data.length;
        
        if (test.key === 'trackingDifficulty') {
          passRate = (data.filter(d => 
            d.trackingDifficulty?.includes('difficult') || 
            d.trackingDifficulty?.includes('কঠিন')
          ).length / total) * 100;
        } else if (test.key === 'quizFrequency') {
          passRate = (data.filter(d => 
            d.quizFrequency === 'Daily' || 
            d.quizFrequency === '4-6 times/week' ||
            d.quizFrequency === 'প্রতিদিন' ||
            d.quizFrequency === '৪-৬ বার/সপ্তাহ'
          ).length / total) * 100;
        } else if (test.key === 'pricingTier') {
          passRate = (data.filter(d => 
            d.pricingTier !== 'Free' && d.pricingTier !== 'ফ্রি'
          ).length / total) * 100;
        } else if (test.key === 'gamificationInterest') {
          passRate = (data.filter(d => 
            d.gamificationInterest?.includes('interested') ||
            d.gamificationInterest?.includes('আগ্রহী')
          ).length / total) * 100;
        }
        
        return {
          ...test,
          actual: Math.round(passRate),
          passed: passRate >= test.target,
          total: total
        };
      });
    });
    
    return results;
  };

  const results = calculateHypothesisResults();

  const generateChartData = () => {
    if (!data) return [];
    
    // Pricing preferences
    const pricingData = data.reduce((acc, entry) => {
      const tier = entry.pricingTier || 'Unknown';
      acc[tier] = (acc[tier] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(pricingData).map(([name, value]) => ({ name, value }));
  };

  const exportResults = () => {
    const report = {
      timestamp: new Date().toISOString(),
      waitlistCount,
      hypothesisResults: results,
      analysis,
      recommendations: analysis?.recommendations || []
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-ai-analysis-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Performance AI Analytics</h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="text-white/80 text-center sm:text-left">
              <span className="text-sm">Waitlist: </span>
              <span className="text-lg sm:text-xl font-bold text-green-400">{waitlistCount}</span>
            </div>
            <a
              href="/"
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Analysis Button */}
        <div className="text-center mb-6 sm:mb-8">
          <button
            onClick={fetchAndAnalyzeData}
            disabled={loading}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base sm:text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 sm:space-x-3 mx-auto"
          >
            {loading ? <Loader className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />}
            <span>{loading ? 'Analyzing...' : 'Run Hypothesis Analysis'}</span>
          </button>
        </div>

        {/* Results Grid */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Hypothesis Validation */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center space-x-2">
                <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Hypothesis Validation</span>
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                {Object.entries(results).map(([category, tests]) => (
                  <div key={category} className="space-y-2 sm:space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold text-blue-300">{hypotheses[category].title}</h3>
                    {tests.map((test, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white/5 rounded-lg space-y-2 sm:space-y-0">
                        <div className="flex items-start sm:items-center space-x-3">
                          {test.passed ? 
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mt-0.5 sm:mt-0" /> : 
                            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mt-0.5 sm:mt-0" />
                          }
                          <span className="text-white/80 text-xs sm:text-sm">{test.threshold}</span>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-white font-medium text-sm sm:text-base">{test.actual}%</div>
                          <div className="text-white/60 text-xs">({test.total} responses)</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div className="space-y-4 sm:space-y-6">
              {/* Pricing Preferences */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Pricing Preferences</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={generateChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {generateChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Feature Interest */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Feature Interest Levels</h3>
                <div className="space-y-3">
                  {Object.entries(results).map(([category, tests]) => {
                    const avgScore = tests.reduce((sum, test) => sum + test.actual, 0) / tests.length;
                    return (
                      <div key={category} className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                        <span className="text-white/80 text-sm sm:text-base">{hypotheses[category].title}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 sm:w-24 h-2 bg-white/20 rounded-full">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-400 to-green-400 rounded-full"
                              style={{ width: `${Math.min(avgScore, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-medium text-sm sm:text-base">{Math.round(avgScore)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Results */}
        {analysis && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center space-x-2">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>AI-Powered Business Insights</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Validation Summary */}
              <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold text-green-300 mb-2 sm:mb-3">✅ Validated Hypotheses</h3>
                <div className="text-white/80 text-xs sm:text-sm leading-relaxed">
                  {analysis.validation || 'Analysis in progress...'}
                </div>
              </div>

              {/* Key Insights */}
              <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold text-blue-300 mb-2 sm:mb-3">💡 Key Insights</h3>
                <div className="text-white/80 text-xs sm:text-sm leading-relaxed">
                  {analysis.insights || 'Insights will appear here...'}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white/5 rounded-lg p-3 sm:p-4 md:col-span-2 lg:col-span-1">
                <h3 className="text-base sm:text-lg font-semibold text-purple-300 mb-2 sm:mb-3">🚀 Next Steps</h3>
                <div className="text-white/80 text-xs sm:text-sm leading-relaxed">
                  {analysis.recommendations || 'Recommendations loading...'}
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            {analysis.risks && (
              <div className="mt-4 sm:mt-6 bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold text-red-300 mb-2 sm:mb-3">⚠️ Risk Assessment</h3>
                <div className="text-white/80 text-xs sm:text-sm leading-relaxed">
                  {analysis.risks}
                </div>
              </div>
            )}
          </div>
        )}

        {!data && !loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-white/60 text-base sm:text-lg px-4">
              Click "Run Hypothesis Analysis" to start comprehensive data analysis
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzePage;