import React from 'react'

export default function DataViewPanel({ data }) {
  if (!data) return null

  return (
    <div className="data-view p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">详细数据视图</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="data-item">
            <span className="font-medium text-gray-700">{key}:</span>
            <span className="ml-2">
              {Array.isArray(value) ? value.join(', ') : JSON.stringify(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
