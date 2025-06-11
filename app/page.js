'use client'
import React, { useState, useEffect } from 'react';
import { ChevronRight, Brain, Target, TrendingUp, Users, Star, ArrowRight, CheckCircle, Calendar, BookOpen, Briefcase, Globe, Trophy, Zap, Award, Menu, X } from 'lucide-react';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';

const LandingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [language, setLanguage] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  
  const isAdmin = isSignedIn && user?.emailAddresses?.[0]?.emailAddress === 'ultrotech1236@gmail.com';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    major: '',
    year: '',
    currentGPA: '',
    trackingDifficulty: '',
    studyHours: '',
    quizFrequency: '',
    tutorUsage: '',
    cvImportance: '',
    pricingTier: '',
    customPrice: '',
    adTolerance: '',
    trialInterest: '',
    referralReward: '',
    preferredReward: '',
    preferredFeatures: [],
    deviceUsage: '',
    universityType: '',
    studyMethod: '',
    sessionLength: '',
    aiExplanationImportance: '',
    referralLikelihood: '',
    referralSource: '',
    gamificationInterest: '',
    competitiveFeatures: [],
    leaderboardParticipation: '',
    studyStreakImportance: '',
    badgeMotivation: '',
    referralId: ''
  });

  const translations = {
    en: {
      title: "Performance AI",
      hero: "Your AI Study Coach That Tracks Everything",
      heroSub: "Stop juggling multiple apps. Track your GPA, get personalized AI quizzes, and build your career—all in one intelligent platform designed for students.",
      freeOffer: "🎉 FREE Tier Available",
      freeDesc: "Start Free with Basic Features",
      trialDesc: "+ 7-day premium trial • No credit card required",
      getAccess: "Get Early Access",
      joinWaitlist: "Join Waitlist",
      features: {
        quiz: { title: "AI-Powered Quizzes", desc: "Generate personalized quizzes for any subject in seconds" },
        track: { title: "GPA Tracking", desc: "Monitor your academic progress in one unified dashboard" },
        analytics: { title: "Smart Analytics", desc: "Identify your weaknesses and track improvement over time" },
        tutor: { title: "AI Tutor", desc: "Get instant help with homework and concept explanations" }
      },
      steps: {
        personal: "Personal Information",
        academic: "Academic Situation", 
        study: "Study Habits & Preferences",
        features: "Feature Preferences",
        pricing: "Pricing & Plans",
        usage: "Usage & Preferences"
      }
    },
    bn: {
      title: "পারফরমেন্স এআই",
      hero: "আপনার এআই স্টাডি কোচ যা সবকিছু ট্র্যাক করে",
      heroSub: "একাধিক অ্যাপ নিয়ে ঝামেলা বন্ধ করুন। আপনার জিপিএ ট্র্যাক করুন, ব্যক্তিগতকৃত এআই কুইজ পান এবং আপনার ক্যারিয়ার গড়ুন—সবকিছু একটি বুদ্ধিমান প্ল্যাটফর্মে।",
      freeOffer: "🎉 ফ্রি টায়ার উপলব্ধ",
      freeDesc: "বেসিক ফিচার দিয়ে ফ্রি শুরু করুন",
      trialDesc: "+ ৭-দিনের প্রিমিয়াম ট্রায়াল • কোন ক্রেডিট কার্ড প্রয়োজন নেই",
      getAccess: "আর্লি এক্সেস পান",
      joinWaitlist: "ওয়েটলিস্টে যোগ দিন",
      features: {
        quiz: { title: "এআই-চালিত কুইজ", desc: "সেকেন্ডেই যেকোনো বিষয়ের ব্যক্তিগতকৃত কুইজ তৈরি করুন" },
        track: { title: "জিপিএ ট্র্যাকিং", desc: "একটি একীভূত ড্যাশবোর্ডে আপনার একাডেমিক অগ্রগতি মনিটর করুন" },
        analytics: { title: "স্মার্ট অ্যানালিটিক্স", desc: "আপনার দুর্বলতা চিহ্নিত করুন এবং সময়ের সাথে উন্নতি ট্র্যাক করুন" },
        tutor: { title: "এআই টিউটর", desc: "হোমওয়ার্ক এবং ধারণা ব্যাখ্যায় তাৎক্ষণিক সাহায্য পান" }
      },
      steps: {
        personal: "ব্যক্তিগত তথ্য",
        academic: "একাডেমিক অবস্থা",
        study: "অধ্যয়নের অভ্যাস ও পছন্দ",
        features: "ফিচার পছন্দ",
        pricing: "প্রাইসিং ও প্ল্যান",
        usage: "ব্যবহার ও পছন্দ"
      }
    }
  };

  const t = translations[language];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const pricingTiers = [
    {
      name: language === 'bn' ? 'ফ্রি' : 'Free',
      price: '$0',
      description: language === 'bn' ? 'বিজ্ঞাপনসহ বেসিক ফিচার' : 'Basic features with ads',
      features: language === 'bn' ? 
        ['৫টি এআই কুইজ/সপ্তাহ', 'বেসিক জিপিএ ট্র্যাকিং', 'সীমিত ব্যাখ্যা', 'ইমেজ ও ভিডিও বিজ্ঞাপন', '৭-দিনের প্রিমিয়াম ট্রায়াল'] :
        ['5 AI quizzes/week', 'Basic GPA tracking', 'Limited explanations', 'Image & video ads', '7-day premium trial']
    },
    {
      name: language === 'bn' ? 'স্টুডেন্ট' : 'Student',
      price: '$5',
      description: language === 'bn' ? 'ব্যক্তিগত শিক্ষার্থীদের জন্য পারফেক্ট' : 'Perfect for individual students',
      features: language === 'bn' ? 
        ['আনলিমিটেড কুইজ', 'অ্যাডভান্সড অ্যানালিটিক্স', 'এআই টিউটর অ্যাক্সেস', 'কোন বিজ্ঞাপন নেই'] :
        ['Unlimited quizzes', 'Advanced analytics', 'AI tutor access', 'No ads']
    },
    {
      name: language === 'bn' ? 'প্রিমিয়াম' : 'Premium',
      price: '$15',
      description: language === 'bn' ? 'সম্পূর্ণ ফিচার অ্যাক্সেস' : 'Full feature access',
      features: language === 'bn' ? 
        ['স্টুডেন্টের সবকিছু', 'সিভি বিল্ডার', 'ক্যারিয়ার রোডম্যাপ', 'প্রাইওরিটি সাপোর্ট'] :
        ['Everything in Student', 'CV builder', 'Career roadmap', 'Priority support']
    },
    {
      name: language === 'bn' ? 'প্রো' : 'Pro',
      price: '$25',
      description: language === 'bn' ? 'গুরুতর শিক্ষার্থীদের জন্য' : 'For serious students',
      features: language === 'bn' ? 
        ['প্রিমিয়ামের সবকিছু', 'লাইভ টিউটরিং সেশন', 'অ্যাডভান্সড ক্যারিয়ার টুলস', 'ইউনিভার্সিটি পার্টনারশিপ'] :
        ['Everything in Premium', 'Live tutoring sessions', 'Advanced career tools', 'University partnerships']
    }
  ];

  const features = [
    { 
      icon: <Brain className="w-6 h-6" />, 
      title: t.features.quiz.title, 
      desc: t.features.quiz.desc 
    },
    { 
      icon: <Target className="w-6 h-6" />, 
      title: t.features.track.title, 
      desc: t.features.track.desc 
    },
    { 
      icon: <TrendingUp className="w-6 h-6" />, 
      title: t.features.analytics.title, 
      desc: t.features.analytics.desc 
    },
    { 
      icon: <Users className="w-6 h-6" />, 
      title: t.features.tutor.title, 
      desc: t.features.tutor.desc 
    }
  ];

  const steps = [
    {
      title: t.steps.personal,
      fields: [
        { key: "name", label: language === 'bn' ? "পূর্ণ নাম" : "Full Name", type: "text", required: true },
        { key: "email", label: language === 'bn' ? "ইউনিভার্সিটি ইমেইল" : "University Email", type: "email", required: true },
        { key: "phone", label: language === 'bn' ? "ফোন নম্বর" : "Phone Number", type: "tel", required: true },
        { key: "university", label: language === 'bn' ? "ইউনিভার্সিটির নাম" : "University Name", type: "text", required: true },
        { key: "major", label: language === 'bn' ? "মেজর/অধ্যয়নের ক্ষেত্র" : "Major/Field of Study", type: "text", required: true },
        { 
          key: "year", 
          label: language === 'bn' ? "অধ্যয়নের বছর" : "Year of Study", 
          type: "select", 
          options: language === 'bn' ? 
            ["১ম বর্ষ", "২য় বর্ষ", "৩য় বর্ষ", "৪র্থ বর্ষ", "স্নাতক"] :
            ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"], 
          required: true 
        },
        { key: "referralId", label: language === 'bn' ? "রেফারেল কোড (যদি থাকে)" : "Referral Code (if any)", type: "text", required: false }
      ]
    },
    {
      title: t.steps.academic,
      fields: [
        { 
          key: "currentGPA", 
          label: language === 'bn' ? "বর্তমান জিপিএ (যদি আরামদায়ক হয়)" : "Current GPA (if comfortable sharing)", 
          type: "select", 
          options: language === 'bn' ? 
            ["২.৫ এর নিচে", "২.৫-৩.০", "৩.০-৩.৫", "৩.৫-৪.০", "বলতে চাই না"] :
            ["Below 2.5", "2.5-3.0", "3.0-3.5", "3.5-4.0", "Prefer not to say"]
        },
        { 
          key: "trackingDifficulty", 
          label: language === 'bn' ? "আপনার একাডেমিক অগ্রগতি ট্র্যাক করা কতটা কঠিন?" : "How difficult is it to track your academic progress?", 
          type: "select", 
          options: language === 'bn' ? 
            ["খুবই কঠিন", "কিছুটা কঠিন", "নিরপেক্ষ", "কিছুটা সহজ", "খুবই সহজ"] :
            ["Very difficult", "Somewhat difficult", "Neutral", "Somewhat easy", "Very easy"], 
          required: true 
        },
        { 
          key: "studyHours", 
          label: language === 'bn' ? "প্রতি সপ্তাহে অধ্যয়নে ব্যয়িত ঘণ্টা" : "Hours spent studying per week", 
          type: "select", 
          options: language === 'bn' ? 
            ["৫ ঘণ্টার কম", "৫-১০ ঘণ্টা", "১০-২০ ঘণ্টা", "২০-৩০ ঘণ্টা", "৩০+ ঘণ্টা"] :
            ["<5 hours", "5-10 hours", "10-20 hours", "20-30 hours", ">30 hours"], 
          required: true 
        }
      ]
    },
    {
      title: t.steps.study,
      fields: [
        { 
          key: "quizFrequency", 
          label: language === 'bn' ? "আপনি কত ঘন ঘন দৈনিক এআই-জেনারেটেড কুইজ ব্যবহার করবেন?" : "How often would you use daily AI-generated quizzes?", 
          type: "select", 
          options: language === 'bn' ? 
            ["প্রতিদিন", "৪-৬ বার/সপ্তাহ", "২-৩ বার/সপ্তাহ", "সাপ্তাহিক", "কদাচিৎ"] :
            ["Daily", "4-6 times/week", "2-3 times/week", "Weekly", "Rarely"], 
          required: true 
        },
        { 
          key: "tutorUsage", 
          label: language === 'bn' ? "এআই Q&A টিউটরের সাথে প্রতি সপ্তাহে কত ঘণ্টা ব্যয় করবেন" : "Hours per week you'd spend with an AI Q&A tutor", 
          type: "select", 
          options: language === 'bn' ? 
            ["১ ঘণ্টার কম", "১-২ ঘণ্টা", "২-৪ ঘণ্টা", "৪+ ঘণ্টা"] :
            ["<1 hour", "1-2 hours", "2-4 hours", "4+ hours"], 
          required: true 
        },
        { 
          key: "studyMethod", 
          label: language === 'bn' ? "পছন্দের অধ্যয়ন পদ্ধতি" : "Preferred study method", 
          type: "select", 
          options: language === 'bn' ? 
            ["ভিজ্যুয়াল লার্নার", "প্র্যাকটিস প্রশ্ন", "নোট পড়া", "ভিডিও কন্টেন্ট", "গ্রুপ স্টাডি"] :
            ["Visual learner", "Practice questions", "Reading notes", "Video content", "Group study"]
        },
        { 
          key: "sessionLength", 
          label: language === 'bn' ? "আদর্শ অধ্যয়ন সেশনের দৈর্ঘ্য" : "Ideal study session length", 
          type: "select", 
          options: language === 'bn' ? 
            ["১৫ মিনিটের কম", "১৫-৩০ মিনিট", "৩০-৬০ মিনিট", "১-২ ঘণ্টা", "২+ ঘণ্টা"] :
            ["<15 minutes", "15-30 minutes", "30-60 minutes", "1-2 hours", ">2 hours"]
        }
      ]
    },
    {
      title: t.steps.features,
      fields: [
        { 
          key: "cvImportance", 
          label: language === 'bn' ? "এআই-চালিত সিভি তৈরি আপনার জন্য কতটা গুরুত্বপূর্ণ?" : "How important is AI-powered CV building for you?", 
          type: "select", 
          options: language === 'bn' ? 
            ["অত্যন্ত গুরুত্বপূর্ণ", "খুবই গুরুত্বপূর্ণ", "কিছুটা গুরুত্বপূর্ণ", "খুব গুরুত্বপূর্ণ নয়", "গুরুত্বপূর্ণ নয়"] :
            ["Extremely important", "Very important", "Somewhat important", "Not very important", "Not important"], 
          required: true 
        },
        { 
          key: "aiExplanationImportance", 
          label: language === 'bn' ? "ভুল উত্তরের জন্য বিস্তারিত এআই ব্যাখ্যা কতটা গুরুত্বপূর্ণ?" : "How important are detailed AI explanations for wrong answers?", 
          type: "select", 
          options: language === 'bn' ? 
            ["অত্যন্ত গুরুত্বপূর্ণ", "খুবই গুরুত্বপূর্ণ", "কিছুটা গুরুত্বপূর্ণ", "খুব গুরুত্বপূর্ণ নয়", "গুরুত্বপূর্ণ নয়"] :
            ["Extremely important", "Very important", "Somewhat important", "Not very important", "Not important"]
        },
        { 
          key: "preferredFeatures", 
          label: language === 'bn' ? "কোন ফিচারগুলো আপনার সবচেয়ে আগ্রহের?" : "Which features interest you most?", 
          type: "multiselect", 
          options: language === 'bn' ? 
            ["এআই কুইজ জেনারেটর", "জিপিএ ট্র্যাকিং", "স্টাডি শিডিউলার", "এআই টিউটর", "সিভি বিল্ডার", "জব ম্যাচিং", "ক্যারিয়ার রোডম্যাপ"] :
            ["AI Quiz Generator", "GPA Tracking", "Study Scheduler", "AI Tutor", "CV Builder", "Job Matching", "Career Roadmap"], 
          required: true 
        },
        {
          key: "gamificationInterest",
          label: language === 'bn' ? "গেমিফিকেশন ফিচার (পয়েন্ট, ব্যাজ, লেভেল) আপনার আগ্রহ জাগায়?" : "Are you interested in gamification features (points, badges, levels)?",
          type: "select",
          options: language === 'bn' ? 
            ["খুবই আগ্রহী", "কিছুটা আগ্রহী", "নিরপেক্ষ", "খুব আগ্রহী নয়", "আগ্রহী নয়"] :
            ["Very interested", "Somewhat interested", "Neutral", "Not very interested", "Not interested"],
          required: true
        },
        {
          key: "competitiveFeatures",
          label: language === 'bn' ? "কোন প্রতিযোগিতামূলক ফিচার আপনাকে আরও পড়তে অনুপ্রাণিত করবে?" : "Which competitive features would motivate you to study more?",
          type: "multiselect",
          options: language === 'bn' ? 
            ["বিশ্বব্যাপী লিডারবোর্ড", "বন্ধুদের সাথে প্রতিযোগিতা", "স্টাডি স্ট্রিক চ্যালেঞ্জ", "সাপ্তাহিক র‍্যাঙ্কিং", "অর্জনের ব্যাজ", "কোনটিই নয়"] :
            ["Global leaderboards", "Friend competitions", "Study streak challenges", "Weekly rankings", "Achievement badges", "None of these"]
        }
      ]
    },
    {
      title: t.steps.pricing,
      description: language === 'bn' ? 
        "আমরা বেসিক ফিচার এবং বিজ্ঞাপনসহ একটি ফ্রি টায়ার এবং প্রিমিয়াম অপশন অফার করি:" :
        "We offer a FREE tier with basic features and ads, plus premium options:",
      fields: [
        { key: "pricingTier", label: language === 'bn' ? "কোন প্রাইসিং টায়ার আপনার সবচেয়ে আগ্রহের?" : "Which pricing tier interests you most?", type: "pricing", required: true },
        { key: "customPrice", label: language === 'bn' ? "যদি 'অন্যান্য', আপনি মাসে কত পে করবেন?" : "If 'Other', what would you pay per month?", type: "text", conditional: "pricingTier", conditionalValue: "Other" },
        { key: "adTolerance", label: language === 'bn' ? "ফ্রি ভার্সনে বিজ্ঞাপন সম্পর্কে আপনার মতামত?" : "How do you feel about ads in the free version?", type: "select", options: language === 'bn' ? ["বিজ্ঞাপন মাইনে করি না", "ফ্রি ফিচারের জন্য সহনীয়", "নিরপেক্ষ", "বিজ্ঞাপন ছাড়া পছন্দ", "বিজ্ঞাপনের কারণে এড়িয়ে যাব"] : ["Don't mind ads", "Tolerable for free features", "Neutral", "Prefer no ads", "Would avoid due to ads"], required: true },
        { key: "trialInterest", label: language === 'bn' ? "৭-দিনের প্রিমিয়াম ট্রায়ালে আগ্রহ?" : "Interest in 7-day premium trial?", type: "select", options: language === 'bn' ? ["খুবই আগ্রহী", "কিছুটা আগ্রহী", "নিরপেক্ষ", "খুব আগ্রহী নয়", "আগ্রহী নয়"] : ["Very interested", "Somewhat interested", "Neutral", "Not very interested", "Not interested"], required: true },
        { key: "referralReward", label: language === 'bn' ? "সফল রেফারেলের জন্য ক্যাশ ব্যাক পেতে আগ্রহী?" : "Interest in earning cash back for successful referrals?", type: "select", options: language === 'bn' ? ["খুবই আগ্রহী - বিস্তারিত চাই", "কিছুটা আগ্রহী", "নিরপেক্ষ", "খুব আগ্রহী নয়", "আগ্রহী নয়"] : ["Very interested - want details", "Somewhat interested", "Neutral", "Not very interested", "Not interested"], required: true },
        { key: "preferredReward", label: language === 'bn' ? "প্রতিটি পেইং বন্ধুর জন্য পছন্দের রেফারেল রিওয়ার্ড?" : "Preferred referral reward for each paying friend?", type: "select", options: language === 'bn' ? ["$৫ ক্যাশ ব্যাক", "$১০ ক্যাশ ব্যাক", "$১৫ ক্যাশ ব্যাক", "১ মাস ফ্রি", "অন্য পরিমাণ"] : ["$5 cash back", "$10 cash back", "$15 cash back", "1 month free", "Other amount"], required: true }
      ]
    },
    {
      title: t.steps.usage, 
      fields: [
        { key: "deviceUsage", label: language === 'bn' ? "অধ্যয়নের জন্য প্রাথমিক ডিভাইস" : "Primary device for studying", type: "select", options: language === 'bn' ? ["মোবাইল ফোন", "ল্যাপটপ", "ডেস্কটপ", "ট্যাবলেট", "মিক্সড ডিভাইস"] : ["Mobile phone", "Laptop", "Desktop", "Tablet", "Mix of devices"], required: true },
        { key: "universityType", label: language === 'bn' ? "ইউনিভার্সিটির ধরন" : "University type", type: "select", options: language === 'bn' ? ["পাবলিক ইউনিভার্সিটি", "প্রাইভেট ইউনিভার্সিটি", "কমিউনিটি কলেজ", "অনলাইন ইউনিভার্সিটি"] : ["Public university", "Private university", "Community college", "Online university"] },
        { key: "referralSource", label: language === 'bn' ? "আমাদের সম্পর্কে আপনি কীভাবে জানলেন?" : "How did you hear about us?", type: "select", options: language === 'bn' ? ["সোশ্যাল মিডিয়া (ইনস্টাগ্রাম/টিকটক)", "ইউনিভার্সিটি স্টুডেন্ট গ্রুপ", "বন্ধু/সহপাঠী", "অনলাইন সার্চ", "ইউনিভার্সিটি ক্যারিয়ার সেন্টার", "স্টাডি গ্রুপ/ফোরাম", "ইউটিউব বিজ্ঞাপন", "ফেসবুক বিজ্ঞাপন", "রেডিট", "লিংকডইন", "অন্যান্য"] : ["Social media (Instagram/TikTok)", "University student group", "Friend/classmate", "Online search", "University career center", "Study group/forum", "YouTube ad", "Facebook ad", "Reddit", "LinkedIn", "Other"], required: true },
        { key: "referralLikelihood", label: language === 'bn' ? "বন্ধুদের কাছে সুপারিশ করার সম্ভাবনা" : "Likelihood to recommend to friends", type: "select", options: language === 'bn' ? ["খুবই সম্ভাবনাময়", "সম্ভাবনাময়", "নিরপেক্ষ", "অসম্ভাব্য", "খুবই অসম্ভাব্য"] : ["Very likely", "Likely", "Neutral", "Unlikely", "Very unlikely"] },
        {
          key: "leaderboardParticipation",
          label: language === 'bn' ? "বন্ধু ও সহপাঠীদের সাথে লিডারবোর্ডে প্রতিযোগিতায় আগ্রহ?" : "Interest in competing with friends and peers on leaderboards?",
          type: "select",
          options: language === 'bn' ? 
            ["খুবই আগ্রহী", "কিছুটা আগ্রহী", "নিরপেক্ষ", "খুব আগ্রহী নয়", "আগ্রহী নয়"] :
            ["Very interested", "Somewhat interested", "Neutral", "Not very interested", "Not interested"],
          required: true
        },
        {
          key: "studyStreakImportance",
          label: language === 'bn' ? "স্টাডি স্ট্রিক (দিন) ট্র্যাক করা কতটা অনুপ্রেরণাদায়ক?" : "How motivating would tracking study streaks (consecutive days) be?",
          type: "select",
          options: language === 'bn' ? 
            ["খুবই অনুপ্রেরণাদায়ক", "কিছুটা অনুপ্রেরণাদায়ক", "নিরপেক্ষ", "খুব অনুপ্রেরণাদায়ক নয়", "অনুপ্রেরণাদায়ক নয়"] :
            ["Very motivating", "Somewhat motivating", "Neutral", "Not very motivating", "Not motivating"]
        },
        {
          key: "badgeMotivation",
          label: language === 'bn' ? "অর্জনের ব্যাজ আপনাকে আরও পড়তে অনুপ্রাণিত করবে?" : "Would earning achievement badges motivate you to study more?",
          type: "select",
          options: language === 'bn' ? 
            ["হ্যাঁ, অবশ্যই", "সম্ভবত", "নিরপেক্ষ", "সম্ভবত না", "না, মোটেও না"] :
            ["Yes, definitely", "Probably", "Neutral", "Probably not", "No, not at all"]
        }
      ]
    }
  ];

  const renderField = (field) => {
    if (field.type === 'pricing') {
      return (
        <div className="space-y-4">
          {/* Free Tier Highlight */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 animate-pulse">
            <h4 className="font-semibold text-green-800 mb-2">{t.freeOffer}</h4>
            <p className="text-green-700 text-sm">{language === 'bn' ? 'আমাদের ফ্রি ভার্সন দিয়ে শুরু করুন যাতে রয়েছে বেসিক ফিচার, বিজ্ঞাপন এবং ৭-দিনের প্রিমিয়াম ট্রায়াল।' : 'Start with our free version including basic features, ads, and a 7-day premium trial to test all features.'}</p>
          </div>

          {pricingTiers.map(tier => (
            <label key={tier.name} className="flex items-start space-x-3 p-4 bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 cursor-pointer transition-all duration-200 hover:shadow-md">
              <input
                type="radio"
                name="pricingTier"
                value={tier.name}
                checked={formData.pricingTier === tier.name}
                onChange={(e) => updateFormData('pricingTier', e.target.value)}
                className="mt-1 text-blue-400"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-white">{tier.name}</span>
                  <span className="font-bold text-blue-300">{tier.price}/month</span>
                </div>
                <p className="text-sm text-white/80 mb-2">{tier.description}</p>
                <ul className="text-xs text-white/70 space-y-1">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </label>
          ))}

          {/* Custom Price Option */}
          <label className="flex items-center space-x-3 p-4 bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 cursor-pointer transition-all duration-200">
            <input
              type="radio"
              name="pricingTier"
              value="Other"
              checked={formData.pricingTier === "Other"}
              onChange={(e) => updateFormData('pricingTier', e.target.value)}
              className="text-blue-400"
            />
            <span className="font-medium text-white">{language === 'bn' ? 'অন্য পরিমাণ' : 'Other amount'}</span>
          </label>
        </div>
      );
    }

    if (field.conditional && formData[field.conditional] !== field.conditionalValue) {
      return null;
    }

    if (field.type === 'select') {
      return (
        <select
          value={formData[field.key]}
          onChange={(e) => updateFormData(field.key, e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 text-base transition-all duration-200"
          required={field.required}
        >
          <option value="">{language === 'bn' ? 'একটি বিকল্প নির্বাচন করুন' : 'Select an option'}</option>
          {field.options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'multiselect') {
      return (
        <div className="space-y-2">
          {field.options.map(option => (
            <label key={option} className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded transition-colors duration-200">
              <input
                type="checkbox"
                checked={formData[field.key].includes(option)}
                onChange={(e) => {
                  const current = formData[field.key] || [];
                  if (e.target.checked) {
                    updateFormData(field.key, [...current, option]);
                  } else {
                    updateFormData(field.key, current.filter(item => item !== option));
                  }
                }}
                className="rounded text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );
    }

    return (
      <input
        type={field.type}
        value={formData[field.key]}
        onChange={(e) => updateFormData(field.key, e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 text-base font-medium transition-all duration-200"
        required={field.required}
        placeholder={field.key === 'customPrice' ? (language === 'bn' ? 'পরিমাণ লিখুন (যেমন, $১২)' : 'Enter amount (e.g., $12)') : ''}
      />
    );
  };

  const canProceed = () => {
    const currentStepData = steps[currentStep - 1];
    return currentStepData.fields.every(field => {
      if (field.conditional && formData[field.conditional] !== field.conditionalValue) {
        return true;
      }
      
      if (field.required) {
        const value = formData[field.key];
        if (field.type === 'multiselect') {
          return value && value.length > 0;
        }
        return value && value.trim() !== '';
      }
      
      return true;
    });
  };

  const submitForm = async () => {
    try {
      const response = await fetch('/api/backend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          language: language,
          ...formData,
          preferredFeatures: Array.isArray(formData.preferredFeatures) ? formData.preferredFeatures.join(', ') : '',
          competitiveFeatures: Array.isArray(formData.competitiveFeatures) ? formData.competitiveFeatures.join(', ') : ''
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(language === 'bn' ? 
          `ধন্যবাদ ${formData.name}! আপনার তথ্য সংরক্ষিত হয়েছে।\n\nআপনার রেফারেল কোড: ${result.referralCode}\n\nবন্ধুদের রেফার করুন এবং রিওয়ার্ড পান!` :
          `Thank you ${formData.name}! Your information has been saved.\n\nYour referral code: ${result.referralCode}\n\nRefer friends and earn rewards!`
        );
        // Redirect to landing page after 3 seconds
        setTimeout(() => {
          setCurrentStep(0);
        }, 3000);
      } else {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(language === 'bn' ? 
        'আপনার তথ্য সংরক্ষণে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন বা সরাসরি যোগাযোগ করুন।' :
        'There was an error saving your information. Please try again or contact us directly.'
      );
    }
  };

  if (currentStep > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Language Toggle */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">
                  {language === 'bn' ? `ধাপ ${currentStep} এর ${steps.length}` : `Step ${currentStep} of ${steps.length}`}
                </span>
                <span className="text-white/60">{Math.round((currentStep / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-white/20 animate-fadeIn">
              <h2 className="text-2xl font-bold text-white mb-2">{steps[currentStep - 1].title}</h2>
              {steps[currentStep - 1].description && (
                <p className="text-white/80 mb-6">{steps[currentStep - 1].description}</p>
              )}
              
              <div className="space-y-6">
                {steps[currentStep - 1].fields.map(field => (
                  <div key={field.key} className="animate-slideIn">
                    <label className="block text-sm font-medium text-white mb-2">
                      {field.label}
                      {field.required && <span className="text-red-400">*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-all duration-200 transform hover:scale-105"
                >
                  {language === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
                </button>
                
                {currentStep === steps.length ? (
                  <button
                    onClick={submitForm}
                    disabled={!canProceed()}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                  >
                    <Trophy className="w-5 h-5" />
                    <span>{language === 'bn' ? 'ওয়েটলিস্টে যোগ দিন' : 'Join Waitlist'}</span>
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                  >
                    <span>{language === 'bn' ? 'পরবর্তী' : 'Next'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in;
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <nav className="container mx-auto px-4 py-6 relative z-20">
        <div className="flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8" />
            <span>{t.title}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAdmin && (
              <>
                <a
                  href="/referrals"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
                >
                  Referrals
                </a>
                <a
                  href="/analyze"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Analytics
                </a>
              </>
            )}
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
            >
              {t.joinWaitlist}
            </button>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10 p-4 space-y-4">
            {isAdmin && (
              <>
                <a
                  href="/referrals"
                  className="block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Referrals
                </a>
                <a
                  href="/analyze"
                  className="block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Analytics
                </a>
              </>
            )}
            <button
              onClick={() => {
                setLanguage(language === 'en' ? 'bn' : 'en');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
            <button
              onClick={() => {
                setCurrentStep(1);
                setMobileMenuOpen(false);
              }}
              className="w-full px-6 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
            >
              {t.joinWaitlist}
            </button>
            <div className="flex justify-center">
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <SignInButton mode="modal">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 animate-fadeIn leading-tight">
            {t.hero.split(' ').slice(0, -1).join(' ')}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block sm:inline">
              {' ' + t.hero.split(' ').slice(-1)}
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto animate-slideIn px-4 sm:px-0">
            {t.heroSub}
          </p>

          {/* Free Tier Highlight */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 max-w-sm sm:max-w-md mx-auto border border-white/20 animate-pulse">
            <div className="text-green-400 text-sm font-medium">{t.freeOffer}</div>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">
              {t.freeDesc}
            </div>
            <div className="text-white/60 text-xs sm:text-sm">{t.trialDesc}</div>
          </div>

          <button
            onClick={() => setCurrentStep(1)}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base sm:text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-2xl flex items-center space-x-2 mx-auto group"
          >
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-pulse" />
            <span>{t.getAccess}</span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-white/60 text-xs sm:text-sm mt-4">
            {language === 'bn' ? 'ইতিমধ্যে ৫০০+ ছাত্রছাত্রী ওয়েটলিস্টে যোগ দিয়েছে' : 'Join 500+ students already on the waitlist'}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12 sm:py-20 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12 animate-fadeIn">
          {language === 'bn' ? 'সফল হওয়ার জন্য আপনার যা প্রয়োজন' : 'Everything You Need to Succeed'}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:rotate-1 border border-white/10 animate-slideIn" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="text-blue-400 mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70 text-sm sm:text-base">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gamification Preview */}
      <section className="container mx-auto px-4 py-12 sm:py-20 relative z-10">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/10">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4 flex items-center justify-center space-x-2 flex-wrap">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              <span className="text-center">{language === 'bn' ? 'গেমিফাইড লার্নিং অভিজ্ঞতা' : 'Gamified Learning Experience'}</span>
            </h3>
            <p className="text-white/80 text-sm sm:text-base px-4 sm:px-0">
              {language === 'bn' ? 
                'বিশ্বব্যাপী লিডারবোর্ড, অর্জনের ব্যাজ এবং স্টাডি স্ট্রিক দিয়ে আপনার পড়ালেখাকে মজাদার করুন' :
                'Make studying fun with global leaderboards, achievement badges, and study streaks'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white/10 rounded-lg p-4 sm:p-6 text-center transform hover:scale-105 transition-all duration-200">
              <Award className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-400 mx-auto mb-3" />
              <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">
                {language === 'bn' ? 'বিশ্বব্যাপী র‍্যাঙ্কিং' : 'Global Rankings'}
              </h4>
              <p className="text-white/70 text-xs sm:text-sm">
                {language === 'bn' ? 
                  'বিশ্বের শিক্ষার্থীদের সাথে প্রতিযোগিতা করুন' :
                  'Compete with students worldwide'
                }
              </p>
            </div>

            <div className="bg-white/10 rounded-lg p-4 sm:p-6 text-center transform hover:scale-105 transition-all duration-200">
              <Target className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400 mx-auto mb-3" />
              <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">
                {language === 'bn' ? 'স্টাডি স্ট্রিক' : 'Study Streaks'}
              </h4>
              <p className="text-white/70 text-xs sm:text-sm">
                {language === 'bn' ? 
                  'দৈনিক অধ্যয়নের ধারাবাহিকতা বজায় রাখুন' :
                  'Maintain daily study consistency'
                }
              </p>
            </div>

            <div className="bg-white/10 rounded-lg p-4 sm:p-6 text-center transform hover:scale-105 transition-all duration-200 col-span-1 sm:col-span-2 lg:col-span-1">
              <Star className="w-8 h-8 sm:w-12 sm:h-12 text-purple-400 mx-auto mb-3" />
              <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">
                {language === 'bn' ? 'অর্জনের ব্যাজ' : 'Achievement Badges'}
              </h4>
              <p className="text-white/70 text-xs sm:text-sm">
                {language === 'bn' ? 
                  'মাইলস্টোন অর্জনের জন্য ব্যাজ আনলক করুন' :
                  'Unlock badges for reaching milestones'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-12 sm:py-20 relative z-10">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/10">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">
              {language === 'bn' ? 'শীর্ষ বিশ্ববিদ্যালয়ের শিক্ষার্থীদের দ্বারা বিশ্বস্ত' : 'Trusted by Students at Top Universities'}
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-white/60 text-sm sm:text-base">
              <span>Stanford</span>
              <span>MIT</span>
              <span>Harvard</span>
              <span>UC Berkeley</span>
              <span>NYU</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { 
                name: "Sarah M.", 
                university: "Stanford CS", 
                text: language === 'bn' ? 
                  "অবশেষে, একটি টুল যা আমাকে আরও স্মার্টভাবে পড়তে সাহায্য করে।" :
                  "Finally, a tool that actually helps me study smarter, not harder." 
              },
              { 
                name: "Alex R.", 
                university: "MIT Engineering", 
                text: language === 'bn' ?
                  "এআই কুইজগুলো এত ভালো যে আমি অন্যান্য স্টাডি অ্যাপ ব্যবহার বন্ধ করে দিয়েছি।" :
                  "The AI quizzes are so good, I stopped using other study apps." 
              },
              { 
                name: "Maria L.", 
                university: "Harvard Business", 
                text: language === 'bn' ?
                  "একজায়গায় সবকিছু ট্র্যাক করতে পারা দারুণ। গেম চেঞ্জার!" :
                  "Love how it tracks everything in one place. Game changer!" 
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4 sm:p-6 transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/80 mb-3 text-sm sm:text-base">"{testimonial.text}"</p>
                <div className="text-white/60 text-xs sm:text-sm">
                  <div>{testimonial.name}</div>
                  <div>{testimonial.university}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-12 sm:py-20 text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 px-4 sm:px-0">
          {language === 'bn' ? 'আপনার স্টাডি গেম রূপান্তরিত করতে প্রস্তুত?' : 'Ready to Transform Your Study Game?'}
        </h2>
        <p className="text-base sm:text-xl text-white/80 mb-6 sm:mb-8 px-4 sm:px-0">
          {language === 'bn' ? 
            'ইতিমধ্যে হাজারো শিক্ষার্থী এআই ব্যবহার করে তাদের পড়ালেখায় এগিয়ে যাচ্ছে' :
            'Join thousands of students already using AI to ace their studies'
          }
        </p>
        
        <button
          onClick={() => setCurrentStep(1)}
          className="px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg sm:text-xl font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-2xl group"
        >
          <span className="flex items-center space-x-2">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" />
            <span>{language === 'bn' ? 'আপনার যাত্রা শুরু করুন' : 'Start Your Journey'}</span>
          </span>
        </button>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-white/10 relative z-10">
        <div className="flex flex-col items-center space-y-4">
          {/* WhatsApp Contact */}
          <a
            href={`https://wa.me/8801755557150?text=${encodeURIComponent(
              language === 'bn' ? 
                'হ্যালো! আমি Performance AI সম্পর্কে জানতে আগ্রহী।' :
                'Hello! I am interested in learning more about Performance AI.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515"/>
            </svg>
            <span>{language === 'bn' ? 'WhatsApp এ যোগাযোগ করুন' : 'Contact us on WhatsApp'}</span>
          </a>
          
          <div className="text-center text-white/60">
            <p>&copy; 2024 Performance AI. {language === 'bn' ? 'সকল অধিকার সংরক্ষিত।' : 'All rights reserved.'}</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;