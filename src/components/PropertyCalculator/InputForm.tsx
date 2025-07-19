import { Languages, Info } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import type { PropertyData, CalculationResults } from '../../types/property'
import { formatStampDuty, getRefundMessage } from '../../utils/stampDutyCalculator'
import { calculateAutomaticRates } from '../../utils/calculationHelpers'

interface InputFormProps {
  propertyData: PropertyData
  onInputChange: (field: keyof PropertyData, value: number | string | boolean) => void
  onReset: () => void
  language: string
  setLanguage: (language: 'en' | 'zh') => void
  results: CalculationResults
  getActualPrice: (priceInWan: number) => number
}

const InputForm = ({ 
  propertyData, 
  onInputChange, 
  onReset, 
  language, 
  setLanguage, 
  results, 
  getActualPrice 
}: InputFormProps) => {
  const { t, getLanguageDisplayName, getTooltip } = useLanguage()

  // Calculate automatic rates
  const actualPrice = getActualPrice(propertyData.price)
  const autoRates = calculateAutomaticRates(actualPrice)

  return (
    <div className="card flex-1 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('property.information')}
        </h2>
        <button
          onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
          className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title={`Switch to ${getLanguageDisplayName(language === 'zh' ? 'en' : 'zh')}`}
        >
          <Languages className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Ownership Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('property.ownership')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onInputChange('paymentType', 'cash')}
              className={`p-3 rounded-lg border-2 transition-all ${
                propertyData.paymentType === 'cash'
                  ? 'border-hk-blue bg-blue-50 dark:bg-blue-900/20 text-hk-blue'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-sm font-medium">
                {t('property.fullpayment')}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {t('property.payinfull')}
              </div>
            </button>
            <button
              onClick={() => onInputChange('paymentType', 'mortgage')}
              className={`p-3 rounded-lg border-2 transition-all ${
                propertyData.paymentType === 'mortgage'
                  ? 'border-hk-blue bg-blue-50 dark:bg-blue-900/20 text-hk-blue'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-sm font-medium">
                {t('property.needmortgage')}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {t('property.installment')}
              </div>
            </button>
          </div>
        </div>

        {/* Buyer Type and First Home Buyer in same row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Buyer Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('property.buyertype')}
            </label>
            <div className="space-y-2">
              <button
                onClick={() => onInputChange('buyerType', 'hkpr')}
                className={`w-full p-2 rounded-lg border-2 transition-all text-sm ${
                  propertyData.buyerType === 'hkpr'
                    ? 'border-hk-green bg-green-50 dark:bg-green-900/20 text-hk-green'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">
                  {t('property.hkpr')}
                </div>
                <div className="text-xs text-gray-500">
                  HKPR
                </div>
              </button>
              <button
                onClick={() => onInputChange('buyerType', 'non-hkpr')}
                className={`w-full p-2 rounded-lg border-2 transition-all text-sm ${
                  propertyData.buyerType === 'non-hkpr'
                    ? 'border-hk-red bg-red-50 dark:bg-red-900/20 text-hk-red'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">
                  {t('property.nonhkpr')}
                </div>
                <div className="text-xs text-gray-500">
                  Non-HKPR
                </div>
              </button>
            </div>
          </div>

          {/* First Home Buyer Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('property.firsthome')}
            </label>
            <div className="space-y-2">
              <button
                onClick={() => onInputChange('isFirstHome', true)}
                className={`w-full p-2 rounded-lg border-2 transition-all text-sm ${
                  propertyData.isFirstHome
                    ? 'border-hk-blue bg-blue-50 dark:bg-blue-900/20 text-hk-blue'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {t('property.firsthome.yes')}
              </button>
              <button
                onClick={() => onInputChange('isFirstHome', false)}
                className={`w-full p-2 rounded-lg border-2 transition-all text-sm ${
                  !propertyData.isFirstHome
                    ? 'border-hk-red bg-red-50 dark:bg-red-900/20 text-hk-red'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {t('property.firsthome.no')}
              </button>
            </div>
          </div>
        </div>

        {/* Property Price */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('property.price')}
            </label>
            <div className="group relative">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {getTooltip('property.price')}
              </div>
            </div>
          </div>
          <input
            type="number"
            value={propertyData.price}
            onChange={(e) => onInputChange('price', Number(e.target.value))}
            className="input-field text-sm py-2"
            placeholder="500"
          />
          <div className="text-xs text-gray-500 mt-1">
            {t('property.actualprice')}: HKD {getActualPrice(propertyData.price).toLocaleString()}
          </div>
        </div>

        {/* Rental Income and Management Fee in same row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Rental Income */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('property.rental')}
              </label>
              <div className="group relative">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {getTooltip('property.rental')}
                </div>
              </div>
            </div>
            <input
              type="number"
              value={propertyData.rental}
              onChange={(e) => onInputChange('rental', Number(e.target.value))}
              className="input-field text-sm py-2"
              placeholder="15000"
            />
          </div>

          {/* Management Fee */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('property.managementfee')}
              </label>
              <div className="group relative">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {getTooltip('property.managementfee')}
                </div>
              </div>
            </div>
            <input
              type="number"
              value={propertyData.managementFee}
              onChange={(e) => onInputChange('managementFee', Number(e.target.value))}
              className="input-field text-sm py-2"
              placeholder="2000"
            />
          </div>
        </div>

        {/* Monthly Expenses and Rates in same row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Monthly Expenses */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('property.expenses')}
              </label>
              <div className="group relative">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {getTooltip('property.expenses')}
                </div>
              </div>
            </div>
            <input
              type="number"
              value={propertyData.expenses}
              onChange={(e) => onInputChange('expenses', Number(e.target.value))}
              className="input-field text-sm py-2"
              placeholder="3000"
            />
          </div>

          {/* Rates */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('property.rates')}
              </label>
              <div className="group relative">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {getTooltip('property.rates')}
                </div>
              </div>
            </div>
            <input
              type="number"
              value={propertyData.rates}
              onChange={(e) => onInputChange('rates', Number(e.target.value))}
              className="input-field text-sm py-2"
              placeholder="0"
            />
            {propertyData.rates === 0 && (
              <div className="text-xs text-blue-600 mt-1">
                Auto-estimated: HKD {autoRates.toLocaleString()}/month
              </div>
            )}
          </div>
        </div>

        {/* Appreciation Rate */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('property.appreciation')}
            </label>
            <div className="group relative">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {getTooltip('property.appreciation')}
              </div>
            </div>
          </div>
          <input
            type="number"
            step="0.1"
            value={propertyData.appreciationRate}
            onChange={(e) => onInputChange('appreciationRate', Number(e.target.value))}
            className="input-field text-sm py-2"
            placeholder="3"
          />
        </div>

        {/* Mortgage-specific fields (only show if mortgage is selected) */}
        {propertyData.paymentType === 'mortgage' && (
          <>
            {/* Interest Rate and Mortgage Term in same row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Mortgage Interest Rate */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('property.interest')}
                  </label>
                  <div className="group relative">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      {getTooltip('property.interest')}
                    </div>
                  </div>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={propertyData.interestRate}
                  onChange={(e) => onInputChange('interestRate', Number(e.target.value))}
                  className="input-field text-sm py-2"
                  placeholder="3.5"
                />
              </div>

              {/* Mortgage Term */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('property.mortgageterm')}
                  </label>
                  <div className="group relative">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      {getTooltip('property.mortgageterm')}
                    </div>
                  </div>
                </div>
                <input
                  type="number"
                  value={propertyData.mortgageTerm}
                  onChange={(e) => onInputChange('mortgageTerm', Number(e.target.value))}
                  className="input-field text-sm py-2"
                  placeholder="30"
                />
              </div>
            </div>

            {/* Down Payment */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('property.downpayment')}
                </label>
                <div className="group relative">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    {getTooltip('property.downpayment')}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <select
                  value={propertyData.downPaymentType}
                  onChange={(e) => onInputChange('downPaymentType', e.target.value)}
                  className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hk-blue focus:border-transparent text-sm"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="amount">Amount (HKD)</option>
                </select>
                <input
                  type="number"
                  value={propertyData.downPayment}
                  onChange={(e) => onInputChange('downPayment', Number(e.target.value))}
                  className="input-field text-sm py-2 flex-1"
                  placeholder={propertyData.downPaymentType === 'percentage' ? '30' : '1500000'}
                />
              </div>
            </div>
          </>
        )}

        {/* Stamp Duty */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('stampduty.manual')}
            </label>
            <div className="group relative">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {getTooltip('property.stampduty')}
              </div>
            </div>
          </div>
          <input
            type="number"
            value={propertyData.stampDuty}
            onChange={(e) => onInputChange('stampDuty', Number(e.target.value))}
            className="input-field text-sm py-2"
            placeholder="0"
          />
          <div className="text-xs text-gray-500 mt-1">
            {t('stampduty.autocalc')}: {propertyData.buyerType === 'hkpr' ? 'HKPR' : 'Non-HKPR'} {propertyData.isFirstHome ? '(首置)' : '(非首置)'}
          </div>
          {results.stampDutyInfo.amount > 0 && (
            <div className="text-xs text-blue-600 mt-1">
              {formatStampDuty(results.stampDutyInfo.amount)} ({results.stampDutyInfo.description})
            </div>
          )}
          {results.stampDutyInfo.refundEligible && (
            <div className="text-xs text-green-600 mt-1">
              {getRefundMessage(true, language as 'en' | 'zh')}
            </div>
          )}
        </div>

        <div className="flex space-x-3 pt-3">
          <button onClick={onReset} className="btn-secondary flex-1 text-sm py-2">
            {t('reset')}
          </button>
          <button className="btn-primary flex-1 text-sm py-2">
            {t('calculate')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default InputForm 