import React, { useState } from 'react';
import axios from 'axios';

const SystemSettingsPanel = ({ onUpdate }) => {
  const _s = $RefreshSig$();
  _s();
  const initialFormData = {
  'deviceCode': '1001000001',
  'deviceAddress': 1,
  'uploadInterval': 1,
  'compressorDelay': 30,
  'setTemp': 4,
  'tempDeviation': 2
};

const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert to snake_case and include all required fields
      const payload = {
        device_code: formData.deviceCode,
        device_address: Number(formData.deviceAddress),
        upload_interval: Number(formData.uploadInterval),
        compressor_delay: Number(formData.compressorDelay),
        set_temp: Number(formData.setTemp),
        temp_deviation: Number(formData.tempDeviation)
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/system/parameters`, 
        payload
      );
      onUpdate();
    } catch (error) {
      console.error('Error updating settings:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-4">系统设置</h2>
      <form onSubmit={handleSubmit}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">参数</th>
              <th className="p-2 border">值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">设备代码</td>
              <td className="p-2 border">
                <input
                  type="text"
                  name="deviceCode"
                  value={formData.deviceCode}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>
            <tr>
              <td className="p-2 border">设备地址</td>
              <td className="p-2 border">
                <input
                  type="number"
                  name="deviceAddress"
                  value={formData.deviceAddress}
                  onChange={handleChange}
                  min="1"
                  max="255"
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>
            <tr>
              <td className="p-2 border">上传间隔 (秒)</td>
              <td className="p-2 border">
                <input
                  type="number"
                  name="uploadInterval"
                  value={formData.uploadInterval}
                  onChange={handleChange}
                  min="1"
                  max="3600"
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>
            <tr>
              <td className="p-2 border">压缩机延迟 (秒)</td>
              <td className="p-2 border">
                <input
                  type="number"
                  name="compressorDelay"
                  value={formData.compressorDelay}
                  onChange={handleChange}
                  min="1"
                  max="30"
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button 
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          应用设置
        </button>
      </form>
    </div>
  );
};

export default SystemSettingsPanel;
