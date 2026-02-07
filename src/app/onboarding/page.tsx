'use client';

import { useState } from 'react';
import Link from 'next/link';

const PlatformIcon = ({ id, className }: { id: string; className?: string }) => {
  const cn = className || 'w-8 h-8';
  switch (id) {
    case 'stripe':
      return <svg className={cn} viewBox="0 0 24 24" fill="currentColor"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/></svg>;
    case 'paypal':
      return <svg className={cn} viewBox="0 0 24 24" fill="currentColor"><path d="M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z"/></svg>;
    case 'wise':
      return <svg className={cn} viewBox="0 0 24 24" fill="currentColor"><path d="M6.488 7.469 0 15.05h11.585l1.301-3.576H7.922l3.033-3.507.01-.092L8.993 4.48h8.873l-6.878 18.925h4.706L24 .595H2.543l3.945 6.874Z"/></svg>;
    case 'mercury':
      return <svg className={cn} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M7 12h10M12 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    case 'revolut':
      return <svg className={cn} viewBox="0 0 24 24" fill="currentColor"><path d="M20.9133 6.9566C20.9133 3.1208 17.7898 0 13.9503 0H2.424v3.8605h10.9782c1.7376 0 3.177 1.3651 3.2087 3.043.016.84-.2994 1.633-.8878 2.2324-.5886.5998-1.375.9303-2.2144.9303H9.2322a.2756.2756 0 0 0-.2755.2752v3.431c0 .0585.018.1142.052.1612L16.2646 24h5.3114l-7.2727-10.094c3.6625-.1838 6.61-3.2612 6.61-6.9494zM6.8943 5.9229H2.424V24h4.4704z"/></svg>;
    case 'manual':
      return <svg className={cn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"/></svg>;
    default:
      return null;
  }
};

const platforms = [
  { id: 'stripe', name: 'Stripe' },
  { id: 'paypal', name: 'PayPal' },
  { id: 'wise', name: 'Wise' },
  { id: 'mercury', name: 'Mercury' },
  { id: 'revolut', name: 'Revolut' },
  { id: 'manual', name: 'Add manually' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [monthlyGoal, setMonthlyGoal] = useState('');

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="relative min-h-screen bg-[#F5F2EA]">
      {/* Edge Lines */}
      <div className="edge-lines" />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#F5F2EA] border-b border-[#E9E7E2]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl serif">Pulse</Link>
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-1 rounded-full transition-colors ${
                    s <= step ? 'bg-[#E8927C]' : 'bg-[#E9E7E2]'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-[#2A2A28]/50">Step {step} of 4</span>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Connect Platforms */}
          {step === 1 && (
            <div>
              <h1 className="text-4xl md:text-5xl serif mb-4">
                Connect your payment platforms
              </h1>
              <p className="text-lg text-[#2A2A28]/60 mb-12">
                We&apos;ll automatically import your transactions. Select where you receive payments.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`p-6 rounded-2xl text-left transition-all ${
                      selectedPlatforms.includes(platform.id)
                        ? 'bg-[#E8927C] text-white'
                        : 'bg-white hover:bg-[#E9E7E2]'
                    }`}
                  >
                    <span className="mb-4 block"><PlatformIcon id={platform.id} /></span>
                    <span className="font-medium block">{platform.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#B8D4C8]/30 rounded-xl text-sm">
                <span className="text-lg">🔒</span>
                <span className="text-[#2A2A28]/70">We use read-only connections. We can never move money or make changes.</span>
              </div>
            </div>
          )}

          {/* Step 2: Monthly Goal */}
          {step === 2 && (
            <div>
              <h1 className="text-4xl md:text-5xl serif mb-4">
                Set your monthly goal
              </h1>
              <p className="text-lg text-[#2A2A28]/60 mb-12">
                This helps Pulse track your progress and predict if you&apos;re on track.
              </p>

              <div className="mb-8">
                <label className="text-sm text-[#2A2A28]/60 mb-3 block">Target monthly revenue</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl text-[#2A2A28]/30">$</span>
                  <input
                    type="text"
                    value={monthlyGoal}
                    onChange={(e) => setMonthlyGoal(e.target.value.replace(/\D/g, ''))}
                    placeholder="10,000"
                    className="w-full p-5 pl-12 text-3xl bg-white rounded-2xl border border-[#E9E7E2] focus:border-[#2A2A28] outline-none transition-colors"
                  />
                </div>
                <p className="text-sm text-[#2A2A28]/50 mt-3">
                  You can change this anytime in settings.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {['5,000', '10,000', '20,000'].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setMonthlyGoal(amount.replace(',', ''))}
                    className="py-3 bg-white rounded-xl text-sm font-medium hover:bg-[#E9E7E2] transition-colors"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Add Client */}
          {step === 3 && (
            <div>
              <h1 className="text-4xl md:text-5xl serif mb-4">
                Add your first client
              </h1>
              <p className="text-lg text-[#2A2A28]/60 mb-12">
                We&apos;ll detect clients from your payments, but you can add one manually to start.
              </p>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-sm text-[#2A2A28]/60 mb-2 block">Client name</label>
                  <input
                    type="text"
                    placeholder="Acme Design Co."
                    className="w-full p-4 bg-white rounded-xl border border-[#E9E7E2] focus:border-[#2A2A28] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#2A2A28]/60 mb-2 block">Average project value (optional)</label>
                  <input
                    type="text"
                    placeholder="$2,500"
                    className="w-full p-4 bg-white rounded-xl border border-[#E9E7E2] focus:border-[#2A2A28] outline-none transition-colors"
                  />
                </div>
              </div>

              <button className="text-sm text-[#E8927C] font-medium hover:underline">
                + Add another client
              </button>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 4 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-[#B8D4C8] flex items-center justify-center mx-auto mb-8">
                <svg viewBox="0 0 24 24" className="w-10 h-10 stroke-[#2A2A28] fill-none">
                  <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl serif mb-4">You&apos;re all set!</h1>
              <p className="text-lg text-[#2A2A28]/60 mb-12 max-w-md mx-auto">
                Pulse is syncing your payments. Your dashboard will be ready in just a moment.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-[#2A2A28] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#3a3a38] transition-colors"
              >
                Go to Dashboard
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}

          {/* Navigation */}
          {step < 4 && (
            <div className="flex justify-between items-center mt-16 pt-8 border-t border-[#E9E7E2]">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                className={`text-sm font-medium px-6 py-3 rounded-full transition-colors ${
                  step === 1
                    ? 'text-[#2A2A28]/30 cursor-not-allowed'
                    : 'text-[#2A2A28] hover:bg-white'
                }`}
                disabled={step === 1}
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(Math.min(4, step + 1))}
                className="bg-[#2A2A28] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#3a3a38] transition-colors"
              >
                Continue →
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Side Info */}
      <div className="fixed bottom-8 right-8 hidden lg:block">
        <div className="bg-white rounded-2xl p-6 shadow-lg max-w-xs">
          <p className="text-sm text-[#2A2A28]/50 mb-2">You&apos;re in good company</p>
          <p className="text-3xl serif mb-1">2,400+</p>
          <p className="text-sm text-[#2A2A28]/60">freelancers tracking revenue</p>
        </div>
      </div>
    </div>
  );
}
