import { useState } from 'react'
import * as XLSX from 'xlsx'
import './FileUploader.css'

function FileUploader({ onUpload, loading }) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const processFile = (file) => {
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(sheet)

        // Transform data to match database schema
        const expenses = jsonData.map(row => ({
          date: row.Fecha || row.fecha || new Date().toISOString().split('T')[0],
          provider: row.Proveedor || row.proveedor || 'Unknown',
          amount: parseFloat(row.Monto || row.monto || 0),
          category: row.Categoría || row.categoria || 'General',
          description: row.Descripción || row.descripcion || ''
        }))

        onUpload(expenses)
      } catch (error) {
        console.error('Error processing file:', error)
        alert('Error al procesar el archivo')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      processFile(files[0])
    }
  }

  const handleChange = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      processFile(files[0])
    }
  }

  return (
    <div className="file-uploader">
      <h2>📁 Subir Planilla de Gastos</h2>
      <form
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
        className="form-file-input"
      >
        <input
          type="file"
          id="input-file-upload"
          accept=".xlsx,.xls,.csv"
          onChange={handleChange}
          disabled={loading}
        />
        <label
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={dragActive ? 'drag-active' : ''}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div>
            <p>Arrastra tu planilla aquí</p>
            <p>o haz clic para seleccionar</p>
            <p className="small">Soportados: Excel (.xlsx, .xls) o CSV</p>
          </div>
        </label>
      </form>
      {loading && <p className="loading">Procesando archivo...</p>}
    </div>
  )
}

export default FileUploader
