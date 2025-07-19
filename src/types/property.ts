export type PaymentType = 'cash' | 'mortgage'
export type BuyerType = 'hkpr' | 'non-hkpr'

export interface PropertyData {
  paymentType: PaymentType
  buyerType: BuyerType
  isFirstHome: boolean
  price: number // This will store the price in 萬 (10,000 HKD units)
  rental: number
  expenses: number
  managementFee: number
  rates: number // Government rates
  interestRate: number
  mortgageTerm: number
  downPayment: number
  downPaymentType: 'percentage' | 'amount'
  appreciationRate: number
  stampDuty: number
}

export interface CalculationResults {
  totalCost: number
  monthlyMortgage: number
  netMonthlyIncome: number
  grossYield: number
  netYield: number
  totalROI: number
  breakEvenYear: number
  monthlyIncome: number
  annualYield: number
  paybackPeriod: number
  stampDutyInfo: {
    amount: number
    rate: number
    description: string
    refundEligible: boolean
  }
} 