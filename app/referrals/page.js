'use client'
import React, { useState, useEffect } from 'react';
import { Users, Gift, Search, Download, Eye, RefreshCw, ArrowUpRight, ArrowLeft, Loader } from 'lucide-react';
import { useUser, RedirectToSignIn } from '@clerk/nextjs';

const ReferralsPage = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [referralData, setReferralData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('overview');

  const isAdmin = isSignedIn && user?.emailAddresses?.[0]?.emailAddress === 'ultrotech1236@gmail.com';

  // Redirect if not admin
  if (isLoaded && (!isSignedIn || !isAdmin)) {
    return <RedirectToSignIn />;
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  const fetchReferralData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/referrals');
      const result = await response.json();
      setReferralData(result.referrals || []);
      setUserData(result.users || []);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  const getReferrerDetails = (referralCode) => {
    return userData.find(user => user.userReferralCode === referralCode);
  };

  const getReferralStats = () => {
    const totalReferrals = referralData.length;
    const uniqueReferrers = new Set(referralData.map(r => r.referralCode)).size;
    const topReferrers = referralData.reduce((acc, referral) => {
      acc[referral.referralCode] = (acc[referral.referralCode] || 0) + 1;
      return acc;
    }, {});

    return {
      totalReferrals,
      uniqueReferrers,
      topReferrers: Object.entries(topReferrers)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([code, count]) => ({
          code,
          count,
          referrer: getReferrerDetails(code)
        }))
    };
  };

  const stats = getReferralStats();

  const filteredReferrals = referralData.filter(referral =>
    referral.referredName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referral.referredEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referral.referralCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportData = () => {
    const csvData = referralData.map(referral => {
      const referrer = getReferrerDetails(referral.referralCode);
      return {
        timestamp: referral.timestamp,
        referralCode: referral.referralCode,
        referrerName: referrer?.name || 'Unknown',
        referrerEmail: referrer?.email || 'Unknown',
        referrerPhone: referrer?.phone || 'Unknown',
        referredName: referral.referredName,
        referredEmail: referral.referredEmail,
        referredPhone: referral.referredPhone
      };
    });

    const csv = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `referrals-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Referral Tracking</h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={fetchReferralData}
              disabled={loading}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={exportData}
              disabled={referralData.length === 0}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <Gift className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalReferrals}</div>
                <div className="text-white/60 text-sm">Total Referrals</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{stats.uniqueReferrers}</div>
                <div className="text-white/60 text-sm">Active Referrers</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <Eye className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">{userData.length}</div>
                <div className="text-white/60 text-sm">Total Users</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <Gift className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {stats.totalReferrals > 0 ? ((stats.totalReferrals / userData.length) * 100).toFixed(1) : 0}%
                </div>
                <div className="text-white/60 text-sm">Referral Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Referrers */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Top Referrers</h2>
            <div className="space-y-3 sm:space-y-4">
              {stats.topReferrers.map((referrer, index) => (
                <div key={referrer.code} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm sm:text-base">
                        {referrer.referrer?.name || 'Unknown User'}
                      </div>
                      <div className="text-white/60 text-xs sm:text-sm">
                        Code: {referrer.code} | {referrer.referrer?.email || 'Unknown email'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-sm sm:text-base">{referrer.count} referrals</div>
                  </div>
                </div>
              ))}
              {stats.topReferrers.length === 0 && (
                <div className="text-center text-white/60 py-8">
                  No referrals yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, or referral code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="overview">Overview</option>
              <option value="details">Detailed View</option>
            </select>
          </div>
        </div>

        {/* Referrals Table */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Referral Details</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
              <div className="text-white/60">Loading referral data...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                      Referrer
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                      Referred User
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                      Contact
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredReferrals.map((referral, index) => {
                    const referrer = getReferrerDetails(referral.referralCode);
                    return (
                      <tr key={index} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-white">
                          {new Date(referral.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          <div className="text-white font-medium">{referrer?.name || 'Unknown'}</div>
                          <div className="text-white/60 text-xs">Code: {referral.referralCode}</div>
                          <div className="text-white/60 text-xs">{referrer?.email || 'Unknown email'}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          <div className="text-white font-medium">{referral.referredName}</div>
                          <div className="text-white/60 text-xs">{referral.referredEmail}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-white/60">
                          {referral.referredPhone}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredReferrals.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-white/60">
                    {searchTerm ? 'No referrals match your search' : 'No referrals found'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;