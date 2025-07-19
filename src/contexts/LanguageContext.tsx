import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type Language = 'en' | 'zh'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    'property.price': 'Property Price (HKD)',
    'property.rental': 'Monthly Rental Income (HKD)',
    'property.expenses': 'Monthly Expenses (HKD)',
    'property.interest': 'Mortgage Interest Rate (%)',
    'property.downpayment': 'Down Payment (%)',
    'property.vacancy': 'Rental Vacancy Rate (%)',
    'property.stampduty': 'Stamp Duty (HKD)',
    'property.years': 'Holding Period (Years)',
    'property.mortgageterm': 'Mortgage Term (Years)',
    'property.appreciation': 'Projected Annual Appreciation (%)',
    'results.totalcost': 'Total Upfront Cost',
    'results.monthlymortgage': 'Monthly Mortgage Payment',
    'results.netmonthlyincome': 'Net Monthly Income',
    'results.grossyield': 'Gross Yield (%)',
    'results.netyield': 'Net Yield (%)',
    'results.totalroi': 'Total ROI',
    'results.breakeven': 'Break-even Year',
    'results.monthlyincome': 'Monthly Net Income',
    'results.annualyield': 'Annual Return (Yield)',
    'results.payback': 'Payback Period',
    'calculate': 'Calculate',
    'reset': 'Reset',
    'export': 'Export Results',
    'share': 'Share',
    'cost.breakdown': 'Cost Breakdown',
    'income.expense': 'Income vs Expense',
    'roi.timeline': 'ROI Over Time',
  },
  zh: {
    'property.price': '物業價格 (港幣)',
    'property.rental': '月租收入 (港幣)',
    'property.expenses': '月支出 (港幣)',
    'property.interest': '按揭利率 (%)',
    'property.downpayment': '首期付款 (%)',
    'property.vacancy': '空置率 (%)',
    'property.stampduty': '印花稅 (港幣)',
    'property.years': '持有年期 (年)',
    'property.mortgageterm': '按揭年期 (年)',
    'property.appreciation': '預期年升值率 (%)',
    'results.totalcost': '總前期成本',
    'results.monthlymortgage': '月供款',
    'results.netmonthlyincome': '月淨收入',
    'results.grossyield': '毛回報率 (%)',
    'results.netyield': '淨回報率 (%)',
    'results.totalroi': '總投資回報',
    'results.breakeven': '回本年期',
    'results.monthlyincome': '月淨收入',
    'results.annualyield': '年回報率',
    'results.payback': '回本期',
    'calculate': '計算',
    'reset': '重置',
    'export': '匯出結果',
    'share': '分享',
    'cost.breakdown': '成本分析',
    'income.expense': '收支對比',
    'roi.timeline': '投資回報時間線',
  }
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh')

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 