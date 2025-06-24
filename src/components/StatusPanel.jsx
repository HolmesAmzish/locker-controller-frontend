export default function StatusPanel({ status }) {
  if (!status) return null

  return (
    <div className="status-panel bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">当前状态</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium text-gray-500">当前温度</h3>
          <p className="text-3xl font-bold">
            {status.current_temp}°C
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium text-gray-500">目标温度</h3>
          <p className="text-3xl font-bold">
            {status.set_point_temp}°C
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-gray-500 mb-2">锁状态</h3>
        <div className="grid grid-cols-6 gap-2">
          {status.lock_status.map((isOpen, index) => (
            <div 
              key={index}
              className={`p-3 rounded text-center font-medium ${isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              锁 {index + 1}<br/>
              {isOpen ? '开启' : '关闭'}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium text-gray-500">压缩机</h3>
          <p className={`text-xl font-bold ${status.compressor_status === 'ON' ? 'text-green-600' : 'text-red-600'}`}>
            {status.compressor_status}
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium text-gray-500">系统状态</h3>
          <p className="text-xl font-bold">
            {status.system_status}
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium text-gray-500">连接状态</h3>
          <p className={`text-xl font-bold ${status.connected ? 'text-green-600' : 'text-red-600'}`}>
            {status.connected ? '已连接' : '断开'}
          </p>
        </div>
      </div>
    </div>
  )
}
