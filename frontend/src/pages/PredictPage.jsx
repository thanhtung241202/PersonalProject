import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Activity, AlertCircle, Search } from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const PREDICTION_DAYS = 5; 


const generateMockPredictions = (lastValue, numDays) => {
  const predictions = [];
  let currentValue = lastValue;
  for (let i = 0; i < numDays; i++) {
    const change = (Math.random() * 2 - 1) * 0.01 * currentValue; 
    currentValue = currentValue + change;
    predictions.push(Math.round(currentValue));
  }
  return predictions;
};

const StockPredictionChart = ({ labels, values, symbol, isLoading, hasError }) => {
  const chartConfig = useMemo(() => {
    const lastValue = values.length > 0 ? values[values.length - 1] : 0;
    const mockPredictions = generateMockPredictions(lastValue, PREDICTION_DAYS);

    const predictionLabels = Array.from({ length: PREDICTION_DAYS }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1); 
      return date.toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' });
    });

    return {
      data: {
        labels: [...labels, ...predictionLabels], 
        datasets: [{
          label: `${symbol} (Lịch sử)`,
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
        },
        {
          label: `${symbol} (Dự đoán)`,
          data: values.length > 0 
            ? Array(values.length - 1).fill(NaN).concat([lastValue, ...mockPredictions]) 
            : [],
          borderColor: '#FFA500', 
          borderDash: [5, 5], 
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.4,
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#FFA500',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { 
            display: true,
            position: 'top',
            labels: { color: '#e5e7eb' }
          },
          tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#f3f4f6',
            callbacks: { 
              label: (ctx) => `${ctx.dataset.label}: ${new Intl.NumberFormat('vi-VN').format(ctx.raw)} VND` 
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#6b7280', maxTicksLimit: 10 } },
          y: { position: 'right', grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280' } }
        }
      }
    };
  }, [labels, values, symbol]);

  return (
    <div className="w-full h-full bg-[#1e1e1e] rounded-xl border border-[#333] p-4 md:p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500'}`}></span>
          Biểu đồ giá & Dự đoán (30 ngày lịch sử + 5 ngày tới)
        </h3>
      </div>
      <div className="h-[400px]">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-gray-500 gap-2"><Activity className="animate-spin"/>Đang tải...</div>
        ) : hasError ? (
          <div className="h-full flex items-center justify-center text-red-400 gap-2"><AlertCircle/>Lỗi kết nối API hoặc mã cổ phiếu không hợp lệ</div>
        ) : values.length > 0 ? (
          <Line data={chartConfig.data} options={chartConfig.options} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">Chưa có dữ liệu cho mã cổ phiếu này</div>
        )}
      </div>
    </div>
  );
};

const PredictPage = () => {
  const [symbol, setSymbol] = useState('HPG');
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);

  const fetchData = useCallback(async (sym) => {
    if (!sym) return;
    setLoading(true);
    setError(false);
    
    try {
      const response = await fetch(`http://localhost:3000/api/monthly/data/${sym}`);
      if (!response.ok) throw new Error('API Error');
      
      const data = await response.json();
      const sliceNum = 30; 
      const newLabels = data.labels ? data.labels.slice(-sliceNum) : [];
      const newValues = data.values ? data.values.slice(-sliceNum) : [];

      setLabels(newLabels);
      setValues(newValues);
      if (newValues.length > 0) setCurrentPrice(newValues[newValues.length - 1]);

    } catch (e) {
      console.error(e);
      setError(true);
      setValues([]);
      setLabels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(symbol); }, [symbol, fetchData]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
        const val = e.target.value.trim().toUpperCase();
        if(val) setSymbol(val);
    }
  };

  const predictedNext5Days = useMemo(() => {
    if (values.length === 0) return [];
    const lastValue = values[values.length - 1];
    return generateMockPredictions(lastValue, PREDICTION_DAYS);
  }, [values]);


  return (
    <div className="min-h-[calc(100vh-64px)] p-4 md:p-10 font-[Inter]">
      <style jsx="true">{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      <div className="max-w-6xl mx-auto animate-fadeIn">
        <h1 className="text-4xl font-extrabold mb-2 text-blue-400">
          Dự đoán Giá Cổ phiếu
        </h1>
        <p className="text-gray-400 mb-8">
          Xem biểu đồ giá lịch sử và dự đoán mô phỏng cho 5 ngày tiếp theo.
        </p>

        <div className="flex justify-between items-end gap-6 mb-8">
            <div className="w-full max-w-md relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                    defaultValue={symbol}
                    onKeyDown={handleSearch}
                    className="w-full bg-[#1e1e1e] border border-[#333] text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500"
                    placeholder="Nhập mã CP..."
                />
            </div>
            <div className="text-right">
                <h2 className="text-5xl font-bold text-white">{symbol}</h2>
                <p className="text-3xl font-bold mt-1 text-white">
                    {loading ? '---' : new Intl.NumberFormat('vi-VN').format(currentPrice)} VND
                </p>
            </div>
        </div>
        <div className="h-[480px]">
          <StockPredictionChart labels={labels} values={values} symbol={symbol} isLoading={loading} hasError={error} />
        </div>

        {/* Summary of Predictions */}
        <div className="bg-[#1e1e1e] p-6 rounded-xl border border-[#333] shadow-lg mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            Dự đoán Giá 5 Ngày Tiếp Theo (Mô phỏng)
          </h3>
          {predictedNext5Days.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {predictedNext5Days.map((price, index) => (
                <div key={index} className="flex flex-col items-center p-3 border border-[#333] rounded-lg bg-[#0d0d0d]">
                  <p className="text-sm text-gray-400">
                    Ngày {new Date(new Date().setDate(new Date().getDate() + index + 1)).toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' })}
                  </p>
                  <p className="text-lg font-bold text-orange-400 mt-1">
                    {new Intl.NumberFormat('vi-VN').format(price)} VND
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Không có dữ liệu để dự đoán.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictPage;