import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function TemperatureChart({ temperatureHistory }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current);
    
    const resizeHandler = () => chartInstance.current.resize();
    window.addEventListener('resize', resizeHandler);
    
    return () => {
      window.removeEventListener('resize', resizeHandler);
      chartInstance.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current || !temperatureHistory) return;
    
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}°C'
      },
      xAxis: {
        type: 'category',
        data: temperatureHistory.map((_, index) => index + 1),
        name: '记录点'
      },
      yAxis: {
        type: 'value',
        name: '温度 (°C)',
        min: value => Math.floor(value.min) - 2,
        max: value => Math.ceil(value.max) + 2
      },
      series: [{
        data: temperatureHistory,
        type: 'line',
        smooth: false,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(58, 77, 233, 0.8)' },
            { offset: 1, color: 'rgba(58, 77, 233, 0.1)' }
          ])
        }
      }],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    };

    chartInstance.current.setOption(option);
  }, [temperatureHistory]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
}
