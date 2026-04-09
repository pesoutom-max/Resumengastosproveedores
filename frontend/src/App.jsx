import { useState, useEffect } from 'react'
import axios from 'axios'
import FileUploader from './components/FileUploader'
import ExpensesSummary from './components/ExpensesSummary'
import ExpensesTable from './components/ExpensesTable'
import './App.css'

function App() {
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/expenses')
      setExpenses(response.data)
      calculateSummary(response.data)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate summary by provider
  const calculateSummary = (expensesData) => {
    const summary = {}
    expensesData.forEach(expense => {
      if (!summary[expense.provider]) {
        summary[expense.provider] = 0
      }
      summary[expense.provider] += parseFloat(expense.amount)
    })
    setSummary(summary)
  }

  // Handle file upload
  const handleUpload = async (expensesData) => {
    try {
      setLoading(true)
      await axios.post('/api/upload', { expenses: expensesData })
      await fetchExpenses()
    } catch (error) {
      console.error('Error uploading expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load expenses on mount
  useEffect(() => {
    fetchExpenses()
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>📊 Resumen de Gastos por Proveedor</h1>
      </header>

      <main className="main-content">
        <section className="uploader-section">
          <FileUploader onUpload={handleUpload} loading={loading} />
        </section>

        {summary && (
          <section className="summary-section">
            <ExpensesSummary summary={summary} />
          </section>
        )}

        <section className="table-section">
          <ExpensesTable expenses={expenses} loading={loading} />
        </section>
      </main>
    </div>
  )
}

export default App
