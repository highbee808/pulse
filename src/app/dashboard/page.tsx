'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const revenueData = [
  { month: 'Jul', revenue: 4200 },
  { month: 'Aug', revenue: 5800 },
  { month: 'Sep', revenue: 4900 },
  { month: 'Oct', revenue: 7200 },
  { month: 'Nov', revenue: 8100 },
  { month: 'Dec', revenue: 6800 },
  { month: 'Jan', revenue: 8420 },
];

const clients = [
  { name: 'Acme Design Co.', revenue: 12400, projects: 8, color: '#E8927C' },
  { name: 'TechStart Inc.', revenue: 8200, projects: 5, color: '#B8D4C8' },
  { name: 'Bloom Agency', revenue: 6100, projects: 4, color: '#F9D9C6' },
  { name: 'Solo Ventures', revenue: 3480, projects: 2, color: '#E9E7E2' },
];

const recentPayments = [
  { client: 'Acme Design Co.', amount: 2400, date: 'Jan 28', type: 'Stripe' },
  { client: 'TechStart Inc.', amount: 1800, date: 'Jan 25', type: 'PayPal' },
  { client: 'Bloom Agency', amount: 3200, date: 'Jan 22', type: 'Wise' },
  { client: 'Solo Ventures', amount: 1200, date: 'Jan 18', type: 'Stripe' },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('30D');

  const totalRevenue = clients.reduce((sum, c) => sum + c.revenue, 0);

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#F5F3EF]/80 backdrop-blur-md border-b border-[#E9E7E2]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl serif">Pulse</Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-sm text-[#2A2A28] font-medium">Dashboard</Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E8927C] flex items-center justify-center text-xs font-medium text-white">
              JD
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <p className="text-[#2A2A28]/50 mb-2">Good morning, Jordan</p>
            <h1 className="text-4xl md:text-5xl serif">Your revenue overview</h1>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6">
              <p className="text-sm text-[#2A2A28]/50 mb-1">This Month</p>
              <p className="text-3xl md:text-4xl serif">$8,420</p>
              <p className="text-sm text-green-600 mt-2">↑ 18%</p>
            </div>
            <div className="bg-white rounded-2xl p-6">
              <p className="text-sm text-[#2A2A28]/50 mb-1">Predicted</p>
              <p className="text-3xl md:text-4xl serif">$9,200</p>
              <p className="text-sm text-[#2A2A28]/40 mt-2">Next month</p>
            </div>
            <div className="bg-white rounded-2xl p-6">
              <p className="text-sm text-[#2A2A28]/50 mb-1">Active Clients</p>
              <p className="text-3xl md:text-4xl serif">4</p>
              <p className="text-sm text-[#2A2A28]/40 mt-2">1 pending</p>
            </div>
            <div className="bg-white rounded-2xl p-6">
              <p className="text-sm text-[#2A2A28]/50 mb-1">Avg Rate</p>
              <p className="text-3xl md:text-4xl serif">$142</p>
              <p className="text-sm text-green-600 mt-2">↑ $18/hr</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl serif">Revenue Trend</h2>
              <div className="flex gap-2">
                {['7D', '30D', '90D', 'YTD'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                      timeRange === range
                        ? 'bg-[#2A2A28] text-white'
                        : 'text-[#2A2A28]/50 hover:bg-[#F5F3EF]'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E8927C" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#E8927C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#2A2A28', opacity: 0.5 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: '#2A2A28',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      padding: '12px 16px'
                    }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#E8927C"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Client Breakdown */}
            <div className="bg-white rounded-2xl p-6 md:p-8">
              <h2 className="text-xl serif mb-6">Client Breakdown</h2>
              <div className="space-y-4">
                {clients.map((client, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{client.name}</span>
                      <span className="text-sm text-[#2A2A28]/50">
                        ${client.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-[#F5F3EF] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(client.revenue / totalRevenue) * 100}%`,
                          backgroundColor: client.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-[#F5F3EF]">
                <p className="text-sm text-[#2A2A28]/50">
                  Top client generates {Math.round((clients[0].revenue / totalRevenue) * 100)}% of revenue
                </p>
              </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-2xl p-6 md:p-8">
              <h2 className="text-xl serif mb-6">Recent Payments</h2>
              <div className="space-y-4">
                {recentPayments.map((payment, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-[#F5F3EF] last:border-0">
                    <div>
                      <p className="font-medium">{payment.client}</p>
                      <p className="text-sm text-[#2A2A28]/50">{payment.date} · {payment.type}</p>
                    </div>
                    <p className="text-lg serif">${payment.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights Banner */}
          <div className="mt-8 bg-[#E8927C] rounded-2xl p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl serif mb-2">Income Insight</h3>
                <p className="text-white/80">
                  Based on your patterns, February looks strong. You typically see 15% higher revenue after holiday lulls.
                </p>
              </div>
              <Link
                href="/#pricing"
                className="bg-white text-[#2A2A28] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#F5F3EF] transition-colors whitespace-nowrap"
              >
                Get more insights
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
