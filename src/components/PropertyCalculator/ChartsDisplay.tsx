import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import type { PropertyData, CalculationResults } from '../../types/property'
import { calculateTotalROI, calculateAutomaticRates } from '../../utils/calculationHelpers'

interface ChartsDisplayProps {
  propertyData: PropertyData
  results: CalculationResults
  getActualPrice: (priceInWan: number) => number
}

const ChartsDisplay = ({ propertyData, results, getActualPrice }: ChartsDisplayProps) => {
  // Chart data
  const actualPrice = getActualPrice(propertyData.price)
  const costBreakdownData = propertyData.paymentType === 'cash' 
    ? [
        { name: 'Property Price', value: actualPrice, color: '#1e40af' },
        { name: 'Stamp Duty', value: results.stampDutyInfo.amount, color: '#dc2626' }
      ]
    : [
        { name: 'Down Payment', value: propertyData.downPaymentType === 'percentage' ? actualPrice * (propertyData.downPayment / 100) : propertyData.downPayment, color: '#1e40af' },
        { name: 'Stamp Duty', value: results.stampDutyInfo.amount, color: '#dc2626' }
      ]

  // Calculate rates (use auto-calculated if not provided)
  const rates = propertyData.rates > 0 ? propertyData.rates : calculateAutomaticRates(actualPrice)

  const incomeExpenseData = [
    { name: 'Rental Income', value: propertyData.rental, color: '#16a34a' },
    { name: 'Expenses', value: propertyData.expenses, color: '#dc2626' },
    { name: 'Management Fee', value: propertyData.managementFee, color: '#f59e0b' },
    { name: 'Rates', value: rates, color: '#8b5cf6' },
    ...(propertyData.paymentType === 'mortgage' ? [{ name: 'Mortgage', value: results.monthlyMortgage, color: '#06b6d4' }] : [])
  ]

  // Use fixed 10-year period for ROI calculations
  const holdingYears = 10
  const roiData = Array.from({ length: holdingYears }, (_, i) => ({
    year: i + 1,
    roi: calculateTotalROI(actualPrice, propertyData.appreciationRate, i + 1, results.netMonthlyIncome)
  }))

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 min-h-0">
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Cost Breakdown
        </h3>
        <div className="h-32 lg:h-28">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={costBreakdownData}
                cx="50%"
                cy="50%"
                outerRadius={40}
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
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Income vs Expense
        </h3>
        <div className="h-32 lg:h-28">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeExpenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip formatter={(value) => `HKD ${Number(value).toLocaleString()}`} />
              <Bar dataKey="value" fill="#1e40af" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          ROI Timeline (10 Years)
        </h3>
        <div className="h-32 lg:h-28">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={roiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
              <Line type="monotone" dataKey="roi" stroke="#16a34a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default ChartsDisplay 