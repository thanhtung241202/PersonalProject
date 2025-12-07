import React from 'react';
import { Info, ShieldCheck, Zap } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-[fadeIn_0.5s_ease-out]">
      <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-8 md:p-12 shadow-2xl">
        
        {/* Header của Card */}
        <div className="flex items-center gap-4 mb-8 border-b border-[#333] pb-6">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Info className="text-[#3a7bf7] w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-white">Về Stock Tracker</h2>
        </div>
        
        {/* Nội dung chính */}
        <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
          <p>
            <strong className="text-white">Stock Tracker</strong> là dự án cá nhân được xây dựng để theo dõi diễn biến thị trường chứng khoán Việt Nam (HOSE) một cách nhanh chóng và trực quan nhất.
          </p>
          <p>
            Dự án sử dụng công nghệ hiện đại:
          </p>
          
          {/* List tính năng */}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <li className="flex items-center gap-3 bg-[#2a2a2a] p-4 rounded-lg">
              <Zap className="text-yellow-400" size={20} />
              <span>React & Vite (Frontend)</span>
            </li>
            <li className="flex items-center gap-3 bg-[#2a2a2a] p-4 rounded-lg">
              <ShieldCheck className="text-green-400" size={20} />
              <span>Node.js (Backend API)</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;