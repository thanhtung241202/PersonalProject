import React from 'react';
import { Copyright } from 'lucide-react';
const Footer = () => (
  <footer className="bg-[#1a1a1a] border-t border-[#2a2a2a] py-8 mt-auto text-center">
    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
        <Copyright size={14} /> <span>2025 Stock Tracker Inc.</span>
    </div>
  </footer>
);
export default Footer;