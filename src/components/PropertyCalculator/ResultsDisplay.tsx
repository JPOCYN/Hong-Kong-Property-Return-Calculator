import { Download, Share2 } from 'lucide-react'
import type { PropertyData, CalculationResults } from '../../types/property'

interface ResultsDisplayProps {
  results: CalculationResults
  propertyData: PropertyData
  getActualPrice: (priceInWan: number) => number
}

const ResultsDisplay = ({ results, propertyData, getActualPrice }: ResultsDisplayProps) => {
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
    const actualPrice = getActualPrice(propertyData.price)
    if (navigator.share) {
      navigator.share({
        title: 'Hong Kong Property Return Calculator Results',
        text: `Property Price: HKD ${actualPrice.toLocaleString()}\nGross Yield: ${results.grossYield.toFixed(2)}%\nNet Yield: ${results.netYield.toFixed(2)}%\nTotal ROI: ${results.totalROI.toFixed(2)}%`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(`Property Price: HKD ${actualPrice.toLocaleString()}\nGross Yield: ${results.grossYield.toFixed(2)}%\nNet Yield: ${results.netYield.toFixed(2)}%\nTotal ROI: ${results.totalROI.toFixed(2)}%`)
    }
  }

  return (
    <div className="card flex-shrink-0">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Calculation Results
      </h2>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-lg font-bold text-hk-blue">
            HKD {results.totalCost.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {propertyData.paymentType === 'cash' ? 'Total Cost' : 'Total Upfront Cost'}
          </div>
        </div>
        
        {propertyData.paymentType === 'mortgage' && (
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-lg font-bold text-hk-green">
              HKD {results.monthlyMortgage.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Monthly Mortgage
            </div>
          </div>
        )}
        
        <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="text-lg font-bold text-yellow-600">
            HKD {results.netMonthlyIncome.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Net Monthly Income
          </div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-lg font-bold text-purple-600">
            {results.grossYield.toFixed(2)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Gross Yield
          </div>
        </div>

        <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <div className="text-lg font-bold text-indigo-600">
            {results.netYield.toFixed(2)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Net Yield
          </div>
        </div>

        <div className="text-center p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
          <div className="text-lg font-bold text-pink-600">
            {results.totalROI.toFixed(2)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Total ROI (10 years)
          </div>
        </div>

        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 col-span-2">
          <div className="text-lg font-bold text-orange-600">
            {results.breakEvenYear === Infinity ? 'Never' : `${results.breakEvenYear.toFixed(1)} years`}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Break-even Year
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button onClick={exportResults} className="btn-secondary flex items-center justify-center space-x-2 text-sm py-2">
          <Download className="w-3 h-3" />
          <span>Export</span>
        </button>
        <button onClick={shareResults} className="btn-secondary flex items-center justify-center space-x-2 text-sm py-2">
          <Share2 className="w-3 h-3" />
          <span>Share</span>
        </button>
      </div>
    </div>
  )
}

export default ResultsDisplay 