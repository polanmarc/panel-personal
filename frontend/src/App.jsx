import Header from './components/layout/Header.jsx'
import KpiGrid from './components/dashboard/KpiGrid.jsx'
import ShiftBanner from './components/dashboard/ShiftBanner.jsx'
import TasksSection from './components/tasks/TasksSection.jsx'
import DeliveriesSection from './components/deliveries/DeliveriesSection.jsx'
import EventsSection from './components/events/EventsSection.jsx'
import ExpensesSection from './components/expenses/ExpensesSection.jsx'
import SubscriptionsSection from './components/subscriptions/SubscriptionsSection.jsx'
import RecordModal from './components/modal/RecordModal.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
      <Header />

      <main className="max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <KpiGrid />
        <ShiftBanner />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TasksSection />
            <DeliveriesSection />
            <EventsSection />
          </div>

          <aside className="space-y-6">
            <ExpensesSection />
            <SubscriptionsSection />
          </aside>
        </div>
      </main>

      <RecordModal />
    </div>
  )
}
