# 香港買樓回報即時計算機 (Hong Kong Property Return Calculator)

A modern, responsive web application for calculating property investment returns in Hong Kong. Built with React, TypeScript, Tailwind CSS, and Recharts.

## 🚀 Features

### Input Fields
- **Property Price** (HKD) - The total property purchase price
- **Monthly Rental Income** (HKD) - Expected monthly rental income
- **Monthly Expenses** (HKD) - Maintenance, management fees, rates, etc.
- **Mortgage Interest Rate** (%) - Current mortgage interest rate
- **Down Payment** (%) - Percentage of property price as down payment
- **Rental Vacancy Rate** (%) - Expected vacancy rate for rental income
- **Stamp Duty** (HKD) - Auto-calculated or manual override
- **Holding Period** (Years) - Investment holding period

### Output Results
- **Total Upfront Cost** - Down payment + stamp duty
- **Monthly Net Income** - Rental income minus expenses and mortgage
- **Annual Return (Yield)** - Annual ROI percentage
- **Payback Period** - Years to recover initial investment

### Interactive Charts
- **Cost Breakdown Pie Chart** - Visual breakdown of upfront costs
- **Income vs Expense Bar Chart** - Monthly income vs expenses comparison
- **ROI Timeline Line Chart** - Return on investment over time

### Additional Features
- **Dark Mode Toggle** - Switch between light and dark themes
- **Language Toggle** - English and Traditional Chinese support
- **Export Results** - Download calculation results as JSON
- **Share Results** - Share results via native sharing or clipboard
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Lucide React** - Beautiful icons

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/JPOCYN/Hong-Kong-Property-Return-Calculator.git
cd Hong-Kong-Property-Return-Calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Build for Production

```bash
npm run build
```

## 📊 Calculation Logic

### Stamp Duty Calculation
The app automatically calculates Hong Kong stamp duty based on property price:
- Up to HKD 2,000,000: 1.5%
- HKD 2,000,001 - 2,176,470: 2%
- HKD 2,176,471 - 3,000,000: 2.5%
- HKD 3,000,001 - 4,000,000: 3%
- HKD 4,000,001 - 6,000,000: 3.5%
- Above HKD 6,000,000: 4%

### Mortgage Calculation
Uses standard mortgage payment formula:
```
Monthly Payment = P × (r(1+r)^n) / ((1+r)^n - 1)
```
Where:
- P = Principal loan amount
- r = Monthly interest rate
- n = Total number of payments

### ROI Calculation
```
Annual Yield = (Net Monthly Income × 12) / Total Upfront Cost × 100
Payback Period = Total Upfront Cost / (Net Monthly Income × 12)
```

## 🎨 Design Features

- **Modern Hong Kong Fintech Style** - Clean, professional design
- **Responsive Layout** - Left side inputs, right side results and charts
- **Interactive Charts** - Real-time updates with hover effects
- **Smooth Transitions** - Hover effects and animations
- **Accessibility** - Proper labels and keyboard navigation

## 🌐 Deployment

The app is ready for deployment on Vercel, Netlify, or any static hosting service.

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite project
3. Deploy with default settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Hong Kong property market data and regulations
- React and Vite communities
- Tailwind CSS for the beautiful design system
- Recharts for the interactive charts

## 📞 Support

For questions or support, please open an issue on GitHub.

---

Built with ❤️ for Hong Kong property investors
