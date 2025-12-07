import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import StockChart from '../components/StockChart';

const IndexPage = () => {
  const [symbol, setSymbol] = useState('VIC');
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
      // API call tới Backend của bạn (localhost:3000)
      const response = await fetch(`http://localhost:3000/monthly/data/${sym}`);
      if (!response.ok) throw new Error('API Error');
      
      const data = await response.json();
      // Lấy 30 ngày gần nhất
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex justify-between items-end gap-6 mb-8">
        <div className="w-full max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
                defaultValue={symbol}
                onKeyDown={handleSearch}
                className="w-full bg-[#1e1e1e] border border-[#333] text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-blue-500"
                placeholder="Nhập mã CP..."
            />
        </div>
        <div className="text-right">
            <h1 className="text-5xl font-bold text-white">{symbol}</h1>
            <p className="text-3xl font-bold text-white">
                {loading ? '---' : new Intl.NumberFormat('vi-VN').format(currentPrice)}
            </p>
        </div>
      </div>
      <StockChart labels={labels} values={values} symbol={symbol} isLoading={loading} hasError={error} />
    </div>
  );
};
export default IndexPage;