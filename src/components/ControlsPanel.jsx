import { useState } from 'react'

export default function ControlsPanel({ status }) {
  const [tempInput, setTempInput] = useState('')
  const [lockIndices, setLockIndices] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSetTemp = async (e) => {
    e.preventDefault()
    if (!tempInput) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/temperature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temperature: parseFloat(tempInput) })
      })
      if (!response.ok) throw new Error('设置温度失败')
      setTempInput('')
    } catch (err) {
      alert(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenLocks = async (e) => {
    e.preventDefault()
    if (!lockIndices) return
    
    const indices = lockIndices.split(',').map(i => parseInt(i.trim()))
    setIsSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/locks/open`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ indices })
      })
      if (!response.ok) throw new Error('开锁失败')
      setLockIndices('')
    } catch (err) {
      alert(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCompressorControl = async (start) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/compressor/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start })
      })
      if (!response.ok) throw new Error('压缩机控制失败')
      // Status will update automatically via WebSocket
    } catch (err) {
      alert(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAutoControl = async (enable) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/compressor/auto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enable })
      })
      if (!response.ok) throw new Error('自动控制设置失败')
      // Status will update automatically via WebSocket
    } catch (err) {
      alert(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const [deviationInput, setDeviationInput] = useState('')
  const handleSetDeviation = async (e) => {
    e.preventDefault()
    if (!deviationInput) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/temperature/deviation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviation: parseFloat(deviationInput) })
      })
      if (!response.ok) throw new Error('设置温度偏差失败')
      setDeviationInput('')
    } catch (err) {
      alert(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="controls-panel bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">控制面板</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temperature Control */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium text-gray-500 mb-2">设置温度</h3>
          <form onSubmit={handleSetTemp} className="flex gap-2">
            <input
              type="number"
              step="0.1"
              min="-20"
              max="40"
              value={tempInput}
              onChange={(e) => setTempInput(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="输入目标温度"
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? '设置中...' : '设置'}
            </button>
          </form>
        </div>

        {/* Lock Control */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium text-gray-500 mb-2">打开锁</h3>
          <form onSubmit={handleOpenLocks} className="flex gap-2">
            <input
              type="text"
              value={lockIndices}
              onChange={(e) => setLockIndices(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="输入锁编号，如: 1,3,5"
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300"
            >
              {isSubmitting ? '开锁中...' : '开锁'}
            </button>
          </form>
        </div>

        {/* Compressor Manual Control */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium text-gray-500 mb-2">手动控制压缩机</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleCompressorControl(true)}
              disabled={isSubmitting || status?.compressor_status === 'ON'}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-red-300"
            >
              启动
            </button>
            <button
              onClick={() => handleCompressorControl(false)}
              disabled={isSubmitting || status?.compressor_status === 'OFF'}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:bg-gray-300"
            >
              停止
            </button>
          </div>
        </div>

        {/* Auto Control */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium text-gray-500 mb-2">自动温控</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleAutoControl(true)}
              disabled={isSubmitting}
              className={`flex-1 px-4 py-2 rounded ${status?.system_status === 'AUTO' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              启用
            </button>
            <button
              onClick={() => handleAutoControl(false)}
              disabled={isSubmitting}
              className={`flex-1 px-4 py-2 rounded ${status?.system_status !== 'AUTO' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
            >
              禁用
            </button>
          </div>
        </div>

        {/* Temperature Deviation Control */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium text-gray-500 mb-2">设置温度偏差</h3>
          <form onSubmit={handleSetDeviation} className="flex gap-2">
            <input
              type="number"
              step="0.5"
              min="0"
              max="10"
              value={deviationInput}
              onChange={(e) => setDeviationInput(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="输入温度偏差值"
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300"
            >
              {isSubmitting ? '设置中...' : '设置'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
