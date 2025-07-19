import { useState, useEffect } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { calculateStampDuty, getStampDutyRateInfo } from '../../utils/stampDutyCalculator'
import InputForm from './InputForm'
import ResultsDisplay from './ResultsDisplay'
import ChartsDisplay from './ChartsDisplay'
import { calculateMortgagePayment, calculateTotalROI, calculateBreakEvenYear, calculateAutomaticRates } from '../../utils/calculationHelpers'
import type { PropertyData, CalculationResults } from '../../types/property'

const PropertyCalculator = () => {
  const { language, setLanguage } = useLanguage()
  const [propertyData, setPropertyData] = useState<PropertyData>({
    paymentType: 'mortgage',
    buyerType: 'hkpr',
    isFirstHome: false,
    price: 500, // 500萬 = 5,000,000 HKD
    rental: 15000,
    expenses: 3000,
    managementFee: 2000,
    rates: 0, // Will be auto-calculated
    interestRate: 3.5,
    mortgageTerm: 30,
    downPayment: 30,
    downPaymentType: 'percentage',
    appreciationRate: 3,
    stampDuty: 0
  })

  const [results, setResults] = useState<CalculationResults>({
    totalCost: 0,
    monthlyMortgage: 0,
    netMonthlyIncome: 0,
    grossYield: 0,
    netYield: 0,
    totalROI: 0,
    breakEvenYear: 0,
    monthlyIncome: 0,
    annualYield: 0,
    paybackPeriod: 0,
    stampDutyInfo: {
      amount: 0,
      rate: 0,
      description: '',
      refundEligible: false
    }
  })

  // Convert price from 萬 to actual HKD
  const getActualPrice = (priceInWan: number): number => {
    return priceInWan * 10000
  }

  // Calculate results
  useEffect(() => {
    const {
      paymentType,
      buyerType,
      isFirstHome,
      price: priceInWan,
      rental,
      expenses,
      managementFee,
      rates: manualRates,
      interestRate,
      mortgageTerm,
      downPayment,
      downPaymentType,
      appreciationRate,
      stampDuty: manualStampDuty
    } = propertyData

    const actualPrice = getActualPrice(priceInWan)
    
    // Use new stamp duty calculator
    const stampDutyResult = calculateStampDuty(actualPrice, buyerType === 'hkpr', isFirstHome)
    const stampDuty = manualStampDuty > 0 ? manualStampDuty : stampDutyResult.amount
    const stampDutyRateInfo = getStampDutyRateInfo(actualPrice)
    
    // Calculate automatic rates if not provided
    const rates = manualRates > 0 ? manualRates : calculateAutomaticRates(actualPrice)
    
    let totalCost: number
    let monthlyMortgage = 0

    if (paymentType === 'cash') {
      // Full payment - no mortgage
      totalCost = actualPrice + stampDuty
    } else {
      // Mortgage payment
      const downPaymentAmount = downPaymentType === 'percentage' ? actualPrice * (downPayment / 100) : downPayment
      const loanAmount = actualPrice - downPaymentAmount
      monthlyMortgage = calculateMortgagePayment(loanAmount, interestRate, mortgageTerm)
      totalCost = downPaymentAmount + stampDuty
    }

    // Calculate net monthly income
    const netRental = rental
    const totalExpenses = expenses + managementFee + rates + monthlyMortgage
    const netMonthlyIncome = netRental - totalExpenses

    // Calculate yields
    const grossYield = (rental * 12 / actualPrice) * 100
    const netYield = (netMonthlyIncome * 12 / actualPrice) * 100

    // Calculate total ROI (using 10 years as default for buying scenario)
    const holdingYears = 10
    const totalROI = calculateTotalROI(actualPrice, appreciationRate, holdingYears, netMonthlyIncome)

    // Calculate break-even year
    const breakEvenYear = calculateBreakEvenYear(totalCost, netMonthlyIncome)

    // Calculate annual yield and payback period
    const annualYield = (netMonthlyIncome * 12 / totalCost) * 100
    const paybackPeriod = totalCost / (netMonthlyIncome * 12)

    setResults({
      totalCost,
      monthlyMortgage,
      netMonthlyIncome,
      grossYield,
      netYield,
      totalROI,
      breakEvenYear,
      monthlyIncome: netRental,
      annualYield,
      paybackPeriod,
      stampDutyInfo: {
        amount: stampDuty,
        rate: stampDutyRateInfo.rate,
        description: stampDutyRateInfo.description,
        refundEligible: stampDutyResult.noteEligibleForRefund
      }
    })
  }, [propertyData])

  const handleInputChange = (field: keyof PropertyData, value: number | string | boolean) => {
    setPropertyData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const resetForm = () => {
    setPropertyData({
      paymentType: 'mortgage',
      buyerType: 'hkpr',
      isFirstHome: false,
      price: 500, // 500萬
      rental: 15000,
      expenses: 3000,
      managementFee: 2000,
      rates: 0,
      interestRate: 3.5,
      mortgageTerm: 30,
      downPayment: 30,
      downPaymentType: 'percentage',
      appreciationRate: 3,
      stampDuty: 0
    })
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 lg:gap-6 overflow-hidden">
      {/* Left Side - Input Fields */}
      <div className="lg:w-1/2 flex flex-col">
        <InputForm
          propertyData={propertyData}
          onInputChange={handleInputChange}
          onReset={resetForm}
          language={language}
          setLanguage={setLanguage}
          results={results}
          getActualPrice={getActualPrice}
        />
      </div>

      {/* Right Side - Results and Charts */}
      <div className="lg:w-1/2 flex flex-col space-y-4 lg:space-y-3">
        <ResultsDisplay
          results={results}
          propertyData={propertyData}
          getActualPrice={getActualPrice}
        />
        
        <ChartsDisplay
          propertyData={propertyData}
          results={results}
          getActualPrice={getActualPrice}
        />
      </div>
    </div>
  )
}

export default PropertyCalculator 