/**
 * Calculation helper functions for property return calculator
 */

/**
 * Calculate mortgage payment using the standard formula
 * @param principal - Loan amount
 * @param annualRate - Annual interest rate as percentage
 * @param years - Loan term in years
 * @returns Monthly mortgage payment
 */
export function calculateMortgagePayment(principal: number, annualRate: number, years: number): number {
  const monthlyRate = annualRate / 100 / 12
  const totalPayments = years * 12
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
         (Math.pow(1 + monthlyRate, totalPayments) - 1)
}

/**
 * Calculate total ROI after X years with appreciation
 * @param initialPrice - Initial property price
 * @param appreciationRate - Annual appreciation rate as percentage
 * @param years - Holding period in years
 * @param netMonthlyIncome - Net monthly rental income
 * @returns Total ROI as percentage
 */
export function calculateTotalROI(initialPrice: number, appreciationRate: number, years: number, netMonthlyIncome: number): number {
  const finalPrice = initialPrice * Math.pow(1 + appreciationRate / 100, years)
  const totalIncome = netMonthlyIncome * 12 * years
  const totalROI = ((finalPrice + totalIncome - initialPrice) / initialPrice) * 100
  return totalROI
}

/**
 * Calculate break-even year
 * @param totalCost - Total upfront cost
 * @param netMonthlyIncome - Net monthly rental income
 * @returns Break-even year (Infinity if never breaks even)
 */
export function calculateBreakEvenYear(totalCost: number, netMonthlyIncome: number): number {
  if (netMonthlyIncome <= 0) return Infinity
  return totalCost / (netMonthlyIncome * 12)
}

/**
 * Calculate automatic government rates based on property value
 * @param propertyValue - Property value in HKD
 * @returns Monthly rates amount
 */
export function calculateAutomaticRates(propertyValue: number): number {
  // Government rates are typically around 0.1% of property value annually
  const annualRate = 0.001 // 0.1%
  const monthlyRates = (propertyValue * annualRate) / 12
  return Math.round(monthlyRates)
} 