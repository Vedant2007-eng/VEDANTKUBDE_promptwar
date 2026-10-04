"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useDecision } from "@/context/DecisionContext";
import { 
  FolderClock, 
  HelpCircle, 
  Info, 
  Sparkles, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Trash2, 
  ChevronRight,
  ShieldCheck,
  Brain,
  Lightbulb
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { savedDecisions, loadDecision, deleteSavedDecision, theme, toggleTheme, currentDecision, resetDecision } = useDecision();
  
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isDecisionsDrawerOpen, setIsDecisionsDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSelectSaved = (decision: typeof savedDecisions[0]) => {
    loadDecision(decision);
    setIsDecisionsDrawerOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/results");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#050914]/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Logo */}
          <div className="flex items-center gap-6">
            <Logo />
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors hover:text-white hover:bg-white/5 ${
                pathname === "/" ? "text-purple-400 font-semibold bg-purple-500/10" : ""
              }`}
            >
              Home
            </Link>
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="px-3 py-1.5 rounded-lg transition-colors hover:text-white hover:bg-white/5"
            >
              How it Works
            </button>
            <Link
              href="/#examples"
              className="px-3 py-1.5 rounded-lg transition-colors hover:text-white hover:bg-white/5"
            >
              Examples
            </Link>
            <button
              onClick={() => setIsAboutOpen(true)}
              className="px-3 py-1.5 rounded-lg transition-colors hover:text-white hover:bg-white/5"
            >
              About
            </button>
          </nav>

          {/* Right: Controls & Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              aria-label="Toggle visual mode"
              title={theme === "dark" ? "Dark Nebula Mode" : "Deep Midnight Mode"}
            >
              {theme === "dark" ? <Moon size={17} className="text-purple-300" /> : <Sun size={17} className="text-cyan-300" />}
            </button>

            {/* My Decisions Drawer Trigger */}
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<FolderClock size={15} className="text-purple-400" />}
              onClick={() => setIsDecisionsDrawerOpen(true)}
              className="relative"
            >
              <span>My Decisions</span>
              {savedDecisions.length > 0 && (
                <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white">
                  {savedDecisions.length}
                </span>
              )}
            </Button>

            {/* If currently analyzing or on a stage, quick start new */}
            {pathname !== "/" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetDecision();
                  router.push("/");
                }}
              >
                New Decision
              </Button>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-white border border-white/10"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 border border-white/10"
              aria-label="Open mobile menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-[#070B14]/95 backdrop-blur-2xl px-4 py-4 space-y-3">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
            >
              Home
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsHowItWorksOpen(true);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
            >
              How it Works
            </button>
            <Link
              href="/#examples"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
            >
              Examples
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAboutOpen(true);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
            >
              About
            </button>
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="md"
                leftIcon={<FolderClock size={16} />}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsDecisionsDrawerOpen(true);
                }}
                className="w-full justify-start"
              >
                My Decisions ({savedDecisions.length})
              </Button>
              {pathname !== "/" && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    resetDecision();
                    router.push("/");
                  }}
                  className="w-full"
                >
                  Start New Decision
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* How it Works Modal */}
      <Modal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        title="How BlindSpot AI Works"
        maxWidth="lg"
      >
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>
            When making high-stakes decisions, humans are prone to cognitive bottlenecks—anchoring on the first plausible option, overweighting recency, and assuming past growth predicts future certainty.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 text-purple-300 font-semibold mb-1">
                <Brain size={16} />
                <span>1. State Reasoning</span>
              </div>
              <p className="text-xs text-slate-400">
                Describe what you want to do and why you are leaning that way.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 text-blue-300 font-semibold mb-1">
                <Sparkles size={16} />
                <span>2. 15 Perspectives</span>
              </div>
              <p className="text-xs text-slate-400">
                15 specialized AI agents stress-test costs, risks, biases, reversibility, and moats.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-1">
                <ShieldCheck size={16} />
                <span>3. You Decide</span>
              </div>
              <p className="text-xs text-slate-400">
                Answer self-guided reflection prompts and retain 100% agency over the final verdict.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#10182A] border border-white/10 text-xs text-slate-400">
            <strong className="text-purple-300">Core Guarantee:</strong> BlindSpot never commands you to &quot;buy this&quot; or &quot;do that&quot;. It elevates your thinking so you make the best decision on your own terms.
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setIsHowItWorksOpen(false)}>
              Got it, let&apos;s think deeper
            </Button>
          </div>
        </div>
      </Modal>

      {/* About Modal */}
      <Modal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        title="About BlindSpot AI"
        maxWidth="md"
      >
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200 text-sm font-medium">
            &ldquo;Don&apos;t ask AI what to decide. Ask AI what you&apos;re missing.&rdquo;
          </div>
          <p>
            Built for critical thinkers, founders, executives, investors, and students.
            BlindSpot AI exists because the biggest risks in life are not the things we know we don&apos;t know—they are the implicit assumptions we treat as facts without realizing it.
          </p>
          <div className="pt-2 flex justify-end">
            <Button variant="secondary" size="sm" onClick={() => setIsAboutOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* My Decisions Drawer / Modal */}
      <Modal
        isOpen={isDecisionsDrawerOpen}
        onClose={() => setIsDecisionsDrawerOpen(false)}
        title="My Saved Decisions"
        maxWidth="lg"
      >
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {savedDecisions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <FolderClock size={36} className="mx-auto text-slate-500 opacity-60" />
              <p className="text-sm font-medium">No saved decisions yet.</p>
              <p className="text-xs text-slate-500">
                Decisions you analyze and reflect on will appear here for easy reference.
              </p>
            </div>
          ) : (
            savedDecisions.map((dec) => (
              <div
                key={dec.id}
                className="group flex items-center justify-between p-3.5 rounded-xl bg-[#10182A] border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer"
                onClick={() => handleSelectSaved(dec)}
              >
                <div className="flex-1 min-w-0 pr-3">
                  <h4 className="text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                    {dec.decision}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {dec.reasoning}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                    <span>{new Date(dec.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="text-cyan-400">{dec.blindSpots.length} Blind Spots</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSavedDecision(dec.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                    title="Delete decision"
                    aria-label="Delete decision"
                  >
                    <Trash2 size={16} />
                  </button>
                  <ChevronRight size={18} className="text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </>
  );
};
