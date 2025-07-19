import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Download, Share2, Languages } from 'lucide-react'

interface PropertyData {
  price: number
  rental: number
  expenses: number
  interestRate: number
  mortgageTerm: number
  downPayment: number
  downPaymentType: 'percentage' | 'amount'
  vacancyRate: number
  appreciationRate: number
  stampDuty: number
  holdingYears: number
}

interface CalculationResults {
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
}

const PropertyCalculator = () => {
  const { language, setLanguage, t } = useLanguage()
  const [propertyData, setPropertyData] = useState<PropertyData>({
    price: 5000000,
    rental: 15000,
    expenses: 3000,
    interestRate: 3.5,
    mortgageTerm: 30,
    downPayment: 30,
    downPaymentType: 'percentage',
    vacancyRate: 5,
    appreciationRate: 3,
    stampDuty: 0,
    holdingYears: 10
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
    paybackPeriod: 0
  })

  // Calculate stamp duty based on property price
  const calculateStampDuty = (price: number): number => {
    if (price <= 2000000) {
      return price * 0.015
    } else if (price <= 2176470) {
      return price * 0.02
    } else if (price <= 3000000) {
      return price * 0.025
    } else if (price <= 4000000) {
      return price * 0.03
    } else if (price <= 6000000) {
      return price * 0.035
    } else {
      return price * 0.04
    }
  }

  // Calculate mortgage payment
  const calculateMortgagePayment = (principal: number, annualRate: number, years: number): number => {
    const monthlyRate = annualRate / 100 / 12
    const totalPayments = years * 12
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
           (Math.pow(1 + monthlyRate, totalPayments) - 1)
  }

  // Calculate total ROI after X years with appreciation
  const calculateTotalROI = (initialPrice: number, appreciationRate: number, years: number, netMonthlyIncome: number): number => {
    const finalPrice = initialPrice * Math.pow(1 + appreciationRate / 100, years)
    const totalIncome = netMonthlyIncome * 12 * years
    const totalROI = ((finalPrice + totalIncome - initialPrice) / initialPrice) * 100
    return totalROI
  }

  // Calculate break-even year
  const calculateBreakEvenYear = (totalCost: number, netMonthlyIncome: number): number => {
    if (netMonthlyIncome <= 0) return Infinity
    return totalCost / (netMonthlyIncome * 12)
  }

  // Calculate results
  useEffect(() => {
    const {
      price,
      rental,
      expenses,
      interestRate,
      mortgageTerm,
      downPayment,
      downPaymentType,
      vacancyRate,
      appreciationRate,
      stampDuty: manualStampDuty,
      holdingYears
    } = propertyData

    const stampDuty = manualStampDuty > 0 ? manualStampDuty : calculateStampDuty(price)
    const downPaymentAmount = downPaymentType === 'percentage' ? price * (downPayment / 100) : downPayment
    const loanAmount = price - downPaymentAmount
    const monthlyMortgage = calculateMortgagePayment(loanAmount, interestRate, mortgageTerm)

    // Calculate net monthly income
    const vacancyLoss = rental * (vacancyRate / 100)
    const netRental = rental - vacancyLoss
    const netMonthlyIncome = netRental - expenses - monthlyMortgage

    // Calculate total upfront cost
    const totalCost = downPaymentAmount + stampDuty

    // Calculate yields
    const grossYield = (rental * 12 / price) * 100
    const netYield = (netMonthlyIncome * 12 / price) * 100

    // Calculate total ROI
    const totalROI = calculateTotalROI(price, appreciationRate, holdingYears, netMonthlyIncome)

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
      paybackPeriod
    })
  }, [propertyData])

  const handleInputChange = (field: keyof PropertyData, value: number | string) => {
    setPropertyData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const resetForm = () => {
    setPropertyData({
      price: 5000000,
      rental: 15000,
      expenses: 3000,
      interestRate: 3.5,
      mortgageTerm: 30,
      downPayment: 30,
      downPaymentType: 'percentage',
      vacancyRate: 5,
      appreciationRate: 3,
      stampDuty: 0,
      holdingYears: 10
    })
  }

  const exportResults = () => {
    const data = {
      propertyData,
      results,
      timestamp: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'property-calculator-results.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Hong Kong Property Return Calculator Results',
        text: `Property Price: HKD ${propertyData.price.toLocaleString()}\nGross Yield: ${results.grossYield.toFixed(2)}%\nNet Yield: ${results.netYield.toFixed(2)}%\nTotal ROI: ${results.totalROI.toFixed(2)}%`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(`Property Price: HKD ${propertyData.price.toLocaleString()}\nGross Yield: ${results.grossYield.toFixed(2)}%\nNet Yield: ${results.netYield.toFixed(2)}%\nTotal ROI: ${results.totalROI.toFixed(2)}%`)
    }
  }

  // Chart data
  const costBreakdownData = [
    { name: 'Down Payment', value: propertyData.downPaymentType === 'percentage' ? propertyData.price * (propertyData.downPayment / 100) : propertyData.downPayment, color: '#1e40af' },
    { name: 'Stamp Duty', value: results.totalCost - (propertyData.downPaymentType === 'percentage' ? propertyData.price * (propertyData.downPayment / 100) : propertyData.downPayment), color: '#dc2626' }
  ]

  const incomeExpenseData = [
    { name: 'Rental Income', value: propertyData.rental, color: '#16a34a' },
    { name: 'Expenses', value: propertyData.expenses, color: '#dc2626' },
    { name: 'Mortgage', value: results.monthlyMortgage, color: '#f59e0b' }
  ]

  const roiData = Array.from({ length: propertyData.holdingYears }, (_, i) => ({
    year: i + 1,
    roi: calculateTotalROI(propertyData.price, propertyData.appreciationRate, i + 1, results.netMonthlyIncome)
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Side - Input Fields */}
      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {language === 'zh' ? '物業資料輸入' : 'Property Information'}
            </h2>
            <button
              onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Languages className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Property Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('property.price')}
              </label>
              <input
                type="number"
                value={propertyData.price}
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                className="input-field"
                placeholder="5000000"
              />
            </div>

            {/* Rental Income */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('property.rental')}
              </label>
              <input
                type="number"
                value={propertyData.rental}
                onChange={(e) => handleInputChange('rental', Number(e.target.value))}
                className="input-field"
                placeholder="15000"
              />
            </div>

            {/* Holding Years Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('property.years')} ({propertyData.holdingYears} years)
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={propertyData.holdingYears}
                onChange={(e) => handleInputChange('holdingYears', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Mortgage Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('property.interest')}
              </label>
              <input
                type="number"
                step="0.1"
                value={propertyData.interestRate}
                onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                className="input-field"
                placeholder="3.5"
              />
            </div>

            {/* Mortgage Term */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mortgage Term (Years)
              </label>
              <input
                type="number"
                value={propertyData.mortgageTerm}
                onChange={(e) => handleInputChange('mortgageTerm', Number(e.target.value))}
                className="input-field"
                placeholder="30"
              />
            </div>

            {/* Down Payment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Down Payment
              </label>
              <div className="flex space-x-2">
                <select
                  value={propertyData.downPaymentType}
                  onChange={(e) => handleInputChange('downPaymentType', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hk-blue focus:border-transparent"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="amount">Amount (HKD)</option>
                </select>
                <input
                  type="number"
                  value={propertyData.downPayment}
                  onChange={(e) => handleInputChange('downPayment', Number(e.target.value))}
                  className="input-field flex-1"
                  placeholder={propertyData.downPaymentType === 'percentage' ? '30' : '1500000'}
                />
              </div>
            </div>

            {/* Monthly Expenses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('property.expenses')}
              </label>
              <input
                type="number"
                value={propertyData.expenses}
                onChange={(e) => handleInputChange('expenses', Number(e.target.value))}
                className="input-field"
                placeholder="3000"
              />
            </div>

            {/* Vacancy Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('property.vacancy')}
              </label>
              <input
                type="number"
                step="0.1"
                value={propertyData.vacancyRate}
                onChange={(e) => handleInputChange('vacancyRate', Number(e.target.value))}
                className="input-field"
                placeholder="5"
              />
            </div>

            {/* Appreciation Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Projected Annual Appreciation (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={propertyData.appreciationRate}
                onChange={(e) => handleInputChange('appreciationRate', Number(e.target.value))}
                className="input-field"
                placeholder="3"
              />
            </div>

            {/* Stamp Duty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('property.stampduty')} (0 = auto calculate)
              </label>
              <input
                type="number"
                value={propertyData.stampDuty}
                onChange={(e) => handleInputChange('stampDuty', Number(e.target.value))}
                className="input-field"
                placeholder="0"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button onClick={resetForm} className="btn-secondary flex-1">
                {t('reset')}
              </button>
              <button className="btn-primary flex-1">
                {t('calculate')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Results and Charts */}
      <div className="space-y-6">
        {/* Results Summary */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {language === 'zh' ? '計算結果' : 'Calculation Results'}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-hk-blue">
                HKD {results.totalCost.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Upfront Cost
              </div>
            </div>
            
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-hk-green">
                HKD {results.monthlyMortgage.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Monthly Mortgage
              </div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                HKD {results.netMonthlyIncome.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Net Monthly Income
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {results.grossYield.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Gross Yield
              </div>
            </div>

            <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {results.netYield.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Net Yield
              </div>
            </div>

            <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <div className="text-2xl font-bold text-pink-600">
                {results.totalROI.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total ROI ({propertyData.holdingYears} years)
              </div>
            </div>

            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg col-span-2">
              <div className="text-2xl font-bold text-orange-600">
                {results.breakEvenYear === Infinity ? 'Never' : `${results.breakEvenYear.toFixed(1)} years`}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Break-even Year
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button onClick={exportResults} className="btn-secondary flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>{t('export')}</span>
            </button>
            <button onClick={shareResults} className="btn-secondary flex items-center justify-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>{t('share')}</span>
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('cost.breakdown')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: HKD ${(value || 0).toLocaleString()}`}
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `HKD ${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('income.expense')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeExpenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `HKD ${Number(value).toLocaleString()}`} />
                <Bar dataKey="value" fill="#1e40af" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('roi.timeline')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
                <Line type="monotone" dataKey="roi" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyCalculator 