import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type Language = 'en' | 'zh'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  getLanguageDisplayName: (lang: Language) => string
  getTooltip: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    'property.price': 'Property Price (萬 HKD)',
    'property.rental': 'Monthly Rental Income (HKD)',
    'property.expenses': 'Monthly Expenses (HKD)',
    'property.interest': 'Mortgage Interest Rate (%)',
    'property.downpayment': 'Down Payment (%)',
    'property.vacancy': 'Rental Vacancy Rate (%)',
    'property.stampduty': 'Stamp Duty (HKD)',
    'property.years': 'Holding Period (Years)',
    'property.mortgageterm': 'Mortgage Term (Years)',
    'property.appreciation': 'Projected Annual Appreciation (%)',
    'property.managementfee': 'Management Fee (HKD/month)',
    'property.ownership': 'How do you want to buy?',
    'property.buyertype': 'Buyer Type',
    'property.firsthome': 'First Home Buyer',
    'property.fullpayment': 'Full Payment',
    'property.needmortgage': 'Need Mortgage',
    'property.payinfull': 'Pay in full',
    'property.installment': 'Installment payment',
    'property.hkpr': 'HK Permanent Resident',
    'property.nonhkpr': 'Non-Permanent Resident',
    'property.firsthome.yes': 'Yes',
    'property.firsthome.no': 'No',
    'property.actualprice': 'Actual Price',
    'property.rates': 'Rates (HKD/month)',
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
    'property.information': 'Property Information',
    'stampduty.autocalc': 'Auto-calculated based on',
    'stampduty.manual': 'Stamp Duty (0 = auto calculate)',
  },
  zh: {
    'property.price': '物業價格 (萬港幣)',
    'property.rental': '月租收入 (港幣)',
    'property.expenses': '月支出 (港幣)',
    'property.interest': '按揭利率 (%)',
    'property.downpayment': '首期付款 (%)',
    'property.vacancy': '空置率 (%)',
    'property.stampduty': '印花稅 (港幣)',
    'property.years': '持有年期 (年)',
    'property.mortgageterm': '按揭年期 (年)',
    'property.appreciation': '預期年升值率 (%)',
    'property.managementfee': '管理費 (港幣/月)',
    'property.ownership': '你點樣買樓？',
    'property.buyertype': '買家身份',
    'property.firsthome': '首置買家',
    'property.fullpayment': '全數付款',
    'property.needmortgage': '需要申請按揭',
    'property.payinfull': '一次性付清',
    'property.installment': '分期付款',
    'property.hkpr': '香港永久居民',
    'property.nonhkpr': '非永久居民',
    'property.firsthome.yes': '是首置',
    'property.firsthome.no': '不是首置',
    'property.actualprice': '實際價格',
    'property.rates': '差餉 (港幣/月)',
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
    'property.information': '物業資料輸入',
    'stampduty.autocalc': '自動計算基於',
    'stampduty.manual': '印花稅 (0 = 自動計算)',
  }
}

const tooltips = {
  en: {
    'property.price': 'Enter the property price in 萬 (10,000 HKD units)',
    'property.rental': 'Expected monthly rental income from the property',
    'property.expenses': 'Monthly expenses including maintenance, utilities, etc.',
    'property.interest': 'Most banks use H+1.3%, current actual rate is around 3-3.3%',
    'property.downpayment': 'For properties ≥ 10M, usually need 40% or more as down payment',
    'property.managementfee': 'Monthly management fee charged by the building',
    'property.appreciation': 'Expected annual property value appreciation rate',
    'property.mortgageterm': 'Mortgage loan term in years (typically 20-30 years)',
    'property.rates': 'Government rates (usually around 0.1% of property value annually)',
    'property.stampduty': 'Leave as 0 for automatic calculation based on buyer type',
  },
  zh: {
    'property.price': '輸入物業價格，以萬為單位 (1萬 = 10,000港幣)',
    'property.rental': '物業的預期月租收入',
    'property.expenses': '月支出包括維修基金、雜費等固定開支',
    'property.interest': '大多銀行以 H+1.3% 為主，現實際利率約為 3–3.3%',
    'property.downpayment': '一般樓價 ≥ 10M 需付 40% 或以上作首期',
    'property.managementfee': '大廈管理費，按月收取',
    'property.appreciation': '預期物業價值年升值率',
    'property.mortgageterm': '按揭貸款年期 (通常 20-30 年)',
    'property.rates': '政府差餉 (通常為物業價值的 0.1% 每年)',
    'property.stampduty': '留空為 0 會根據買家身份自動計算',
  }
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh')

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  const getLanguageDisplayName = (lang: Language): string => {
    return lang === 'zh' ? 'Chinese (繁體)' : 'English'
  }

  const getTooltip = (key: string): string => {
    return tooltips[language][key as keyof typeof tooltips[typeof language]] || ''
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLanguageDisplayName, getTooltip }}>
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