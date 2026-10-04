"use client";

import React from "react";
import Link from "next/link";
import { Eye, Shield, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#050914] py-8 text-xs text-slate-500 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-purple-400" />
          <span className="font-semibold text-slate-300">BLINDSPOT AI</span>
          <span>—</span>
          <span>Think deeper. Decide better.</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Shield size={14} className="text-emerald-400" />
            Human-in-the-Loop Decision Architecture
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-slate-400">
            Zero Automated Coercion
          </span>
        </div>
      </div>
    </footer>
  );
};
