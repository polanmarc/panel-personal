import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { useDashboard } from '../../context/DashboardContext.jsx'
import { formatCurrency } from '../../utils/formatters.js'
import SectionHeader from '../ui/SectionHeader.jsx'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function ExpensesSection() {
  const { state, stats, openModal } = useDashboard()
  const categories = state.expenses.categories

  const data = {
    labels: categories.map((item) => item.name),
    datasets: [{
      data: categories.map((item) => item.amount),
      backgroundColor: categories.map((item) => item.color),
      borderWidth: 0,
      hoverOffset: 4,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.label}: ${formatCurrency(context.raw)}`,
        },
      },
    },
  }

  return (
    <section className="glass-card rounded-2xl p-5">
      <SectionHeader icon="fa-chart-pie" iconClass="text-rose-400" title="Gastos Este Mes" />
      <div className="text-right -mt-2 mb-1 text-lg font-bold text-rose-400">{formatCurrency(stats.totalExpenses)}</div>
      <div className="relative h-48 w-full my-2">
        <Doughnut data={data} options={options} />
      </div>
      <div className="space-y-2 mt-4 pt-3 border-t border-slate-800 text-xs">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="w-2.5 h-2.5 shrink-0 rounded-full" style={{ backgroundColor: category.color }} />
              <span className="text-slate-300 truncate">{category.name}</span>
            </div>
            <span className="font-semibold text-slate-200 whitespace-nowrap">{formatCurrency(category.amount)}</span>
          </div>
        ))}
      </div>
      <button onClick={() => openModal('expense')} className="w-full mt-4 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center justify-center space-x-2">
        <i className="fa-solid fa-receipt" /><span>Registrar Nuevo Gasto</span>
      </button>
    </section>
  )
}
