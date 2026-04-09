import './ExpensesTable.css'

function ExpensesTable({ expenses, loading }) {
  if (loading) {
    return <div className="expenses-table"><p>Cargando gastos...</p></div>
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="expenses-table">
        <h2>📋 Detalle de Gastos</h2>
        <p className="empty-state">No hay gastos registrados. Sube una planilla para comenzar.</p>
      </div>
    )
  }

  return (
    <div className="expenses-table">
      <h2>📋 Detalle de Gastos</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Proveedor</th>
              <th>Monto</th>
              <th>Categoría</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td><span className="provider-badge">{expense.provider}</span></td>
                <td className="amount">${parseFloat(expense.amount).toFixed(2)}</td>
                <td>{expense.category || '-'}</td>
                <td>{expense.description || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-info">
        <p>Total de gastos: <strong>{expenses.length}</strong></p>
      </div>
    </div>
  )
}

export default ExpensesTable
