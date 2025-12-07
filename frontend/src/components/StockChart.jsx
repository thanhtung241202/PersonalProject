import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Activity, AlertCircle } from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const StockChart = ({ labels, values, symbol, isLoading, hasError }) => {
  const chartConfig = useMemo(() => ({
    data: {
      labels: labels,
      datasets: [{
        label: symbol,
        data: values,
        borderColor: '#3a7bf7',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(58, 123, 247, 0.4)');
          gradient.addColorStop(1, 'rgba(58, 123, 247, 0.0)');
          return gradient;
        },
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#3a7bf7',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1f2937',
          titleColor: '#f3f4f6',
          callbacks: { label: (ctx) => `${new Intl.NumberFormat('vi-VN').format(ctx.raw)} VND` }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#6b7280', maxTicksLimit: 6 } },
        y: { position: 'right', grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280' } }
      }
    }
  }), [labels, values, symbol]);

  return (
    <div className="w-full h-[400px] bg-[#1e1e1e] rounded-xl border border-[#333] p-4 md:p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500'}`}></span>
          Biểu đồ giá (30 ngày)
        </h3>
      </div>
      <div className="h-[300px]">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-gray-500 gap-2"><Activity className="animate-spin"/>Đang tải...</div>
        ) : hasError ? (
          <div className="h-full flex items-center justify-center text-red-400 gap-2"><AlertCircle/>Lỗi kết nối API</div>
        ) : values.length > 0 ? (
          <Line data={chartConfig.data} options={chartConfig.options} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">Chưa có dữ liệu</div>
        )}
      </div>
    </div>
  );
};
export default StockChart;