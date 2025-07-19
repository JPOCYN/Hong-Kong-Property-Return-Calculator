import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import PropertyCalculator from './components/PropertyCalculator'
import { LanguageProvider } from './contexts/LanguageContext'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <LanguageProvider>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <div className="bg-hk-gray dark:bg-gray-900 min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-12 lg:h-14">
                <div className="flex items-center">
                  <h1 className="text-lg lg:text-xl font-bold text-hk-blue dark:text-blue-400">
                    香港買樓回報即時計算機
                  </h1>
                  <span className="ml-2 text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                    Hong Kong Property Return Calculator
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleDarkMode}
                    className="p-1.5 lg:p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {darkMode ? <Sun className="w-4 h-4 lg:w-5 lg:h-5" /> : <Moon className="w-4 h-4 lg:w-5 lg:h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 h-full">
              <PropertyCalculator />
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm">
                  © 2024 Hong Kong Property Return Calculator. Built with React & Tailwind CSS.
                </p>
                <p className="text-xs mt-1">
                  Creator: <span className="font-medium text-hk-blue dark:text-blue-400">OC</span>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </LanguageProvider>
  )
}

export default App
