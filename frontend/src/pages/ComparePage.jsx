import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Activity, AlertCircle, Search, X } from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const CHART_COLORS = [
  '#3a7bf7', 
  '#f73a3a', 
  '#3af794'  
];

const MultiStockChart = ({ historicalData, symbols, isLoading, hasError }) => {
  
  const chartConfig = useMemo(() => {
    const labels = historicalData.length > 0 ? historicalData[0].labels : [];

    const datasets = historicalData
      .filter(stock => stock.values.length > 0)
      .map((stock, index) => {
        const color = CHART_COLORS[index % CHART_COLORS.length];
        
        return {
          label: stock.symbol,
          data: stock.values,
          borderColor: color,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, `${color}40`); 
            gradient.addColorStop(1, `${color}00`); 
            return gradient;
          },
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: '#fff',
          pointBorderColor: color,
          fill: index === 0 ? 'origin' : false, 
        };
      });

    return {
      data: {
        labels: labels,
        datasets: datasets
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
            bodyColor: '#d1d5db',
            callbacks: { 
              label: (ctx) => `${ctx.dataset.label}: ${new Intl.NumberFormat('vi-VN').format(ctx.raw)} VND` 
            }
          }
        },
        scales: {
          x: { 
            grid: { display: false }, 
            ticks: { color: '#6b7280', maxTicksLimit: 6 } 
          },
          y: { 
            position: 'right', 
            grid: { color: 'rgba(255,255,255,0.05)' }, 
            ticks: { color: '#6b7280' } 
          }
        }
      }
    };
  }, [historicalData]);

  const isEmpty = historicalData.filter(d => d.values.length > 0).length === 0;

  return (
    <div className="w-full h-full bg-[#1e1e1e] rounded-xl border border-[#333] p-4 md:p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500'}`}></span>
          So sánh Biểu đồ Giá (30 ngày)
        </h3>
      </div>
      <div className="h-[400px]">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-gray-500 gap-2">
            <Activity className="animate-spin"/>Đang tải dữ liệu...
          </div>
        ) : hasError ? (
          <div className="h-full flex items-center justify-center text-red-400 gap-2">
            <AlertCircle/>Lỗi kết nối API hoặc mã cổ phiếu không hợp lệ
          </div>
        ) : isEmpty ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Hãy nhập ít nhất một mã cổ phiếu để so sánh.
          </div>
        ) : (
          <Line data={chartConfig.data} options={chartConfig.options} />
        )}
      </div>
    </div>
  );
};


const ComparePage = () => {
  const [symbols, setSymbols] = useState(['VIC', 'FPT']); 
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [inputSymbol, setInputSymbol] = useState('');


  const fetchData = useCallback(async (symbolList) => {
    const validSymbols = Array.from(new Set(symbolList.map(s => s.trim().toUpperCase()))).filter(s => s.length > 0);
    
    if (validSymbols.length === 0) {
      setHistoricalData([]);
      return;
    }

    setLoading(true);
    setError(false);
    
    try {
      const fetchPromises = validSymbols.map(async (sym) => {
        const response = await fetch(`http://localhost:3000/api/monthly/data/${sym}`);
        
        if (!response.ok) {
          console.warn(`Could not fetch data for ${sym}. Status: ${response.status}`);
          return { symbol: sym, labels: [], values: [] };
        }
        
        const data = await response.json();
        const sliceNum = 30;
        const newLabels = data.labels ? data.labels.slice(-sliceNum) : [];
        const newValues = data.values ? data.values.slice(-sliceNum) : [];

        return { symbol: sym, labels: newLabels, values: newValues };
      });

      const results = await Promise.all(fetchPromises);
      
      const dataWithContent = results.filter(r => r.values.length > 0);
      
      setHistoricalData(dataWithContent);

    } catch (e) {
      console.error("Lỗi chung khi fetch dữ liệu:", e);
      setError(true);
      setHistoricalData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchData(symbols); 
  }, [symbols, fetchData]);


  const handleAddSymbol = () => {
    const sym = inputSymbol.trim().toUpperCase();
    if (sym && symbols.length < 3 && !symbols.includes(sym)) {
      setSymbols([...symbols, sym]);
      setInputSymbol('');
    }
  };

  const handleRemoveSymbol = (symToRemove) => {
    setSymbols(symbols.filter(s => s !== symToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        handleAddSymbol();
    }
  };


  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-4 md:p-10 font-[Inter]">
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
          Phân tích & So sánh Cổ phiếu
        </h1>
        <p className="text-gray-400 mb-8">
          Theo dõi và so sánh hiệu suất giá trong 30 ngày của tối đa 3 mã cổ phiếu.
        </p>

        <div className="bg-[#1e1e1e] p-6 rounded-xl border border-[#333] shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">
                Mã Cổ phiếu So sánh ({symbols.length}/3)
            </h2>

            <div className="flex gap-4 mb-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                        value={inputSymbol}
                        onChange={(e) => setInputSymbol(e.target.value.toUpperCase())}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-[#0d0d0d] border border-[#333] text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500"
                        placeholder="Nhập mã CP (VD: VNM, HPG)"
                        disabled={symbols.length >= 3 || loading}
                    />
                </div>
                <button
                    onClick={handleAddSymbol}
                    disabled={symbols.length >= 3 || loading || !inputSymbol.trim()}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                        symbols.length >= 3 || !inputSymbol.trim()
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
                    }`}
                >
                    Thêm
                </button>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 min-h-[40px]">
                {symbols.map((sym, index) => (
                    <div 
                        key={sym} 
                        style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                        className="flex items-center text-white px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-300 transform hover:scale-[1.02]"
                    >
                        {sym}
                        <button 
                            onClick={() => handleRemoveSymbol(sym)}
                            className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                            aria-label={`Remove ${sym}`}
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
        <div className="h-[480px]"> 
          <MultiStockChart 
            historicalData={historicalData} 
            symbols={symbols} 
            isLoading={loading} 
            hasError={error} 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {symbols.map((sym, index) => {
                const data = historicalData.find(d => d.symbol === sym);
                const price = data?.values[data.values.length - 1] || 0;
                const color = CHART_COLORS[index % CHART_COLORS.length];
                const notFound = !data || data.values.length === 0;

                return (
                    <div 
                        key={sym} 
                        className="bg-[#1e1e1e] p-5 rounded-xl border-t-4 shadow-lg transition-all duration-300 hover:shadow-2xl"
                        style={{ borderTopColor: color }}
                    >
                        <p className="text-sm font-medium text-gray-400">Giá hiện tại</p>
                        <h3 className="text-3xl font-bold mt-1" style={{ color: color }}>
                            {sym}
                        </h3>
                        <p className="text-2xl mt-2 font-extrabold text-white">
                            {loading && symbols.includes(sym) ? (
                                'Đang tải...'
                            ) : notFound ? (
                                <span className="text-red-500">Không tìm thấy</span>
                            ) : (
                                new Intl.NumberFormat('vi-VN').format(price) + ' VND'
                            )}
                        </p>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default ComparePage;