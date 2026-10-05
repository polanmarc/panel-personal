import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { defaultData } from '../data/defaultData.js'
import {
  createGoogleEvent,
  createGoogleTask,
  deleteGoogleEvent,
  deleteGoogleTask,
  getGoogleAuthStatus,
  getGoogleEvents,
  getGoogleTasks,
  updateGoogleTask,
} from '../services/googleApi.js'

const STORAGE_KEY = 'dashboard_data_v2'
const DashboardContext = createContext(null)

function loadInitialData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultData, ...JSON.parse(saved), tasks: [], events: [] } : defaultData
  } catch {
    return defaultData
  }
}

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload }
    case 'SET_EVENTS':
      return { ...state, events: action.payload }

    case 'ADD_DELIVERY':
      return { ...state, deliveries: [action.payload, ...state.deliveries] }
    case 'DELETE_DELIVERY':
      return { ...state, deliveries: state.deliveries.filter((item) => item.id !== action.payload) }

    case 'ADD_EXPENSE': { 
      const { category, amount } = action.payload
      const exists = state.expenses.categories.some((item) => item.name.toLowerCase() === category.toLowerCase())
      const colors = ['#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#3b82f6']

      const categories = exists
        ? state.expenses.categories.map((item) =>
            item.name.toLowerCase() === category.toLowerCase()
              ? { ...item, amount: item.amount + amount }
              : item,
          )
        : [
            ...state.expenses.categories,
            { name: category, amount, color: colors[state.expenses.categories.length % colors.length] },
          ]

      return { ...state, expenses: { ...state.expenses, categories } }
    }

    case 'ADD_SUBSCRIPTION':
      return { ...state, subscriptions: [action.payload, ...state.subscriptions] }
    case 'DELETE_SUBSCRIPTION':
      return { ...state, subscriptions: state.subscriptions.filter((item) => item.id !== action.payload) }

    case 'RESET_DATA':
      return structuredClone(defaultData)

    default:
      return state
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, undefined, loadInitialData)
  const [modalType, setModalType] = useState(null)
  const [googleConnected, setGoogleConnected] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(true)
  const [integrationError, setIntegrationError] = useState('')

  useEffect(() => {
    let active = true
    const searchParams = new URLSearchParams(window.location.search)
    const oauthError = searchParams.get('google_error')
    const hadOAuthError = Boolean(oauthError)

    if (hadOAuthError) window.history.replaceState(null, '', window.location.pathname)

    async function loadGoogleData() {
      try {
        const status = await getGoogleAuthStatus()
        if (!active) return
        setGoogleConnected(status.connected)
        if (hadOAuthError) {
          const message = oauthError === 'configuration'
            ? 'Configura las credenciales Google OAuth en backend/.env para conectar tu cuenta.'
            : 'No se pudo conectar con Google. Revisa el consentimiento e inténtalo de nuevo.'
          setIntegrationError(message)
        }

        if (status.connected) {
          const [events, tasks] = await Promise.all([getGoogleEvents(), getGoogleTasks()])
          if (!active) return
          dispatch({ type: 'SET_EVENTS', payload: events })
          dispatch({ type: 'SET_TASKS', payload: tasks })
        } else {
          dispatch({ type: 'SET_EVENTS', payload: [] })
          dispatch({ type: 'SET_TASKS', payload: [] })
        }
      } catch (error) {
        if (active) {
          setGoogleConnected(false)
          setIntegrationError(error.message)
        }
      } finally {
        if (active) setGoogleLoading(false)
      }
    }

    loadGoogleData()
    return () => { active = false }
  }, [])

  useEffect(() => {
    const localData = { ...state }
    delete localData.events
    delete localData.tasks
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localData))
  }, [state])

  async function runGoogleMutation(operation, loadData, actionType) {
    setIntegrationError('')
    try {
      await operation()
      const records = await loadData()
      dispatch({ type: actionType, payload: records })
      return true
    } catch (error) {
      setIntegrationError(error.message)
      return false
    }
  }

  const createEvent = (event) => runGoogleMutation(
    () => createGoogleEvent(event), getGoogleEvents, 'SET_EVENTS',
  )
  const deleteEvent = (event) => runGoogleMutation(
    () => deleteGoogleEvent(event), getGoogleEvents, 'SET_EVENTS',
  )
  const createTask = (task) => runGoogleMutation(
    () => createGoogleTask(task), getGoogleTasks, 'SET_TASKS',
  )
  const toggleTask = (task) => runGoogleMutation(
    () => updateGoogleTask(task, !task.completed), getGoogleTasks, 'SET_TASKS',
  )
  const deleteTask = (task) => runGoogleMutation(
    () => deleteGoogleTask(task), getGoogleTasks, 'SET_TASKS',
  )

  const stats = useMemo(() => ({
    pendingTasks: state.tasks.filter((task) => !task.completed).length,
    deliveries: state.deliveries.length,
    events: state.events.length,
    totalExpenses: state.expenses.categories.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    nextSubscription: state.subscriptions.find((item) => item.isNext) ?? state.subscriptions[0] ?? null,
  }), [state])

  const value = {
    state,
    stats,
    dispatch,
    modalType,
    openModal: setModalType,
    closeModal: () => setModalType(null),
    googleConnected,
    googleLoading,
    integrationError,
    connectGoogle: () => { window.location.assign('/auth/google') },
    createEvent,
    deleteEvent,
    createTask,
    toggleTask,
    deleteTask,
  }

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) throw new Error('useDashboard debe usarse dentro de DashboardProvider')
  return context
}
