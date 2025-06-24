import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import StatusPanel from './components/StatusPanel'
import ControlsPanel from './components/ControlsPanel'
import TemperatureChart from './components/TemperatureChart'
import DataViewPanel from './components/DataViewPanel'
import './App.css'

function App() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [socket, setSocket] = useState(null)
  const [temperatureHistory, setTemperatureHistory] = useState([])

  useEffect(() => {
    // Initialize WebSocket connection
    const newSocket = io(import.meta.env.VITE_API_BASE_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server')
      setLoading(false)
      setError(null)
    })

    newSocket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err)
      setError('无法连接到实时服务器')
      setLoading(false)
    })

    newSocket.on('update_status', (data) => {
      console.log('Received status update:', data)
      setStatus(data)
      setTemperatureHistory(prev => {
        const newHistory = [...prev, data.current_temp]
        return newHistory.length > 60 ? newHistory.slice(1) : newHistory
      })
    })

    // Initial status fetch
    const fetchInitialStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/status`)
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()
        setStatus(data)
      } catch (err) {
        console.error('Initial status fetch failed:', err)
      }
    }

    fetchInitialStatus()
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const [activeTab, setActiveTab] = useState('control')

  if (loading) return <div className="loading">正在连接实时服务器...</div>
  if (error) return <div className="error">错误: {error}</div>
  if (!status) return <div className="loading">正在加载初始数据...</div>

  return (
    <div className="app">
      <div className="tabs mb-6">
        <button
          className={`tab-button ${activeTab === 'control' ? 'active' : ''}`}
          onClick={() => setActiveTab('control')}
        >
          控制面板
        </button>
        <button
          className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          详细数据
        </button>
      </div>

      {activeTab === 'control' ? (
        <>
          <StatusPanel status={status} />
          <ControlsPanel status={status} />
          <div className="chart-container mt-6 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">温度变化历史</h2>
            <TemperatureChart temperatureHistory={temperatureHistory} />
          </div>
        </>
      ) : (
        <DataViewPanel data={status} />
      )}
    </div>
  )
}

export default App
