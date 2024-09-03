import React, { useState } from 'react'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [validatorInfo, setValidatorInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchValidator = async () => {
    setIsLoading(true)
    setError(null)
    setValidatorInfo(null)

    try {
      const response = await fetch('https://api.testnet-3.elixirdev.xyz/validators/?limit=10000&order_by=apy&order_dir=desc')
      const data = await response.json()

      const validator = data.validators.find(v => 
        v.address.toLowerCase() === searchTerm.toLowerCase() || 
        (v.display_name && v.display_name.toLowerCase() === searchTerm.toLowerCase())
      )

      if (validator) {
        setValidatorInfo(validator)
      } else {
        setError('Validator not found.')
      }
    } catch (error) {
      setError('Error fetching data. Please try again.')
      console.error('Error:', error)
    }

    setIsLoading(false)
  }

  const UptimeBar = ({ uptime }) => (
    <div className="uptime-bar">
      <div className="uptime-fill" style={{ width: `${uptime}%` }}></div>
    </div>
  )

  return (
    <div className="App">
      <div className="container">
        <h1>Validator Uptime Search</h1>
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter EVM address or validator name"
          />
          <button onClick={searchValidator}>Search</button>
        </div>
        {isLoading && <p>Searching...</p>}
        {error && <p className="error">{error}</p>}
        {validatorInfo && (
          <div className="result">
            <h2>Validator Information</h2>
            <p><strong>Address:</strong> {validatorInfo.address}</p>
            <p><strong>Name:</strong> {validatorInfo.display_name || 'N/A'}</p>
            <p><strong>Uptime (Day):</strong> {(validatorInfo.uptime_day * 100).toFixed(2)}%</p>
            <UptimeBar uptime={validatorInfo.uptime_day * 100} />
            <p><strong>Uptime (Week):</strong> {(validatorInfo.uptime_week * 100).toFixed(2)}%</p>
            <UptimeBar uptime={validatorInfo.uptime_week * 100} />
            <p><strong>Uptime (Month):</strong> {(validatorInfo.uptime_month * 100).toFixed(2)}%</p>
            <UptimeBar uptime={validatorInfo.uptime_month * 100} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App