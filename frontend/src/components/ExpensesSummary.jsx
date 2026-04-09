import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import './ExpensesSummary.css'

function ExpensesSummary({ summary }) {
  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140']

  const data = Object.entries(summary).map(([provider, amount]) => ({
    name: provider,
    value: Math.round(amount * 100) / 100
  }))

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="expenses-summary">
      <h2>📈 Resumen por Proveedor</h2>
      
      <div className="summary-stats">
        <div className="stat-card">
          <span className="stat-label">Total Gastos</span>
          <span className="stat-value">${total.toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Proveedores</span>
          <span className="stat-value">{data.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Promedio por Proveedor</span>
          <span className="stat-value">${(total / data.length).toFixed(2)}</span>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>Distribución por Proveedor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h3>Gastos por Proveedor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Bar dataKey="value" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="provider-list">
        <h3>Detalle por Proveedor</h3>
        <table>
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Total</th>
              <th>Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>
                  <span className="provider-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  {item.name}
                </td>
                <td>${item.value.toFixed(2)}</td>
                <td>{((item.value / total) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ExpensesSummary
