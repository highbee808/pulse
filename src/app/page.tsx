'use client';

import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import Marquee from 'react-fast-marquee';

// ===== Scroll fade-up hook =====
function useScrollFadeUp() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

// ===== ScrollFadeUp wrapper =====
const ScrollFadeUp = ({ children, delay }: { children: ReactNode; delay?: number }) => {
  const ref = useScrollFadeUp();
  return (
    <div
      ref={ref}
      className="scroll-fade-up"
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};

// ===== Animated number (RAF lerp) =====
const AnimatedNumber = ({ value, prefix = '$', suffix = '' }: { value: number; prefix?: string; suffix?: string }) => {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    const duration = 400;
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplay(Math.round(from + (to - from) * ease));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    prevRef.current = to;
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{prefix}{display.toLocaleString()}{suffix}</>;
};

// ===== SwapCTA button =====
const SwapCTA = ({
  href,
  defaultText,
  revealText,
  variant,
}: {
  href: string;
  defaultText: string;
  revealText: string;
  variant: 'primary' | 'secondary';
}) => (
  <Link
    href={href}
    className={`hero-cta-pill hero-cta-pill-${variant}`}
  >
    <span className="hero-cta-text-wrap">
      <span className="hero-cta-default">{defaultText}</span>
      <span className="hero-cta-reveal">{revealText}</span>
    </span>
    <svg className="w-4 h-4 hero-cta-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </Link>
);

// Feature data for carousel
const features = [
  {
    id: 'revenue',
    title: 'Revenue Tracking',
    description: 'Automatically imports payments from all your platforms.',
    stat: '6+',
    statLabel: 'Integrations',
  },
  {
    id: 'prediction',
    title: 'Income Prediction',
    description: 'ML-powered forecasting based on your patterns.',
    stat: '89%',
    statLabel: 'Accuracy',
  },
  {
    id: 'clients',
    title: 'Client Intelligence',
    description: 'See which clients are most profitable.',
    stat: '41%',
    statLabel: 'More clarity',
  },
  {
    id: 'rates',
    title: 'Rate Optimization',
    description: 'Understand your effective hourly rate.',
    stat: '+$24',
    statLabel: 'Avg increase',
  },
];

// Feature Carousel Component - Infinite smooth scroll right to left
const FeatureCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Extended features array for infinite loop (clone first item at end)
  const extendedFeatures = [...features, features[0]];
  const totalSlides = extendedFeatures.length;

  // Render card content based on feature type
  const renderCardContent = (featureId: string, isActive: boolean) => {
    switch (featureId) {
      case 'revenue':
        return <IntegrationCardContent isActive={isActive} />;
      case 'prediction':
        return <PredictionCardContent isActive={isActive} />;
      case 'clients':
        return <ClientCardContent isActive={isActive} />;
      case 'rates':
        return <RateCardContent isActive={isActive} />;
      default:
        return null;
    }
  };

  // Auto slide - always moves right to left
  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => prev + 1);
    }, 5000);
  }, []);

  // Handle infinite loop reset
  useEffect(() => {
    if (activeIndex === features.length) {
      // We've reached the cloned first slide, wait for transition then jump to real first
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(0);
        // Re-enable transition after reset
        setTimeout(() => setIsTransitioning(true), 50);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [activeIndex]);

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoSlide]);

  const goToSlide = (index: number) => {
    const normalizedIndex = ((index % features.length) + features.length) % features.length;
    setActiveIndex(normalizedIndex);
    startAutoSlide();
  };

  // Get visible cards (prev, current, next) with wrapping
  const prev = ((activeIndex - 1) % features.length + features.length) % features.length;
  const current = activeIndex % features.length;
  const next = (activeIndex + 1) % features.length;

  return (
    <div className="relative overflow-hidden py-8">
      {/* Cards Container */}
      <div className="flex items-center justify-center gap-6 px-4">
        {/* Previous Card (faded, partial) */}
        <div
          className="hidden md:block w-[320px] flex-shrink-0 opacity-40 scale-95 cursor-pointer transition-all duration-700 ease-out"
          onClick={() => goToSlide(prev)}
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 h-[260px]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium mb-1">{features[prev].title}</h3>
                <p className="text-xs text-black/50 line-clamp-2">{features[prev].description}</p>
              </div>
            </div>
            <div className="h-[140px] flex items-center justify-center text-black/20">
              <span className="text-4xl serif">{features[prev].stat}</span>
            </div>
          </div>
        </div>

        {/* Active Card (with frame and + markers) */}
        <div className="relative w-full max-w-[420px] flex-shrink-0">
          {/* Frame with + markers */}
          <div className="absolute -inset-4 pointer-events-none">
            {/* Top left + */}
            <div className="absolute top-0 left-0 w-4 h-4">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/20" />
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-black/20" />
            </div>
            {/* Top right + */}
            <div className="absolute top-0 right-0 w-4 h-4">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/20" />
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-black/20" />
            </div>
            {/* Bottom left + */}
            <div className="absolute bottom-0 left-0 w-4 h-4">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/20" />
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-black/20" />
            </div>
            {/* Bottom right + */}
            <div className="absolute bottom-0 right-0 w-4 h-4">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/20" />
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-black/20" />
            </div>
            {/* Border lines */}
            <div className="absolute top-2 left-6 right-6 h-[1px] bg-black/10" />
            <div className="absolute bottom-2 left-6 right-6 h-[1px] bg-black/10" />
            <div className="absolute left-2 top-6 bottom-6 w-[1px] bg-black/10" />
            <div className="absolute right-2 top-6 bottom-6 w-[1px] bg-black/10" />
          </div>

          {/* Sliding cards container */}
          <div className="relative overflow-hidden rounded-2xl h-[260px]">
            <div
              className={`flex ${isTransitioning ? 'transition-transform duration-700 ease-out' : ''}`}
              style={{
                width: `${totalSlides * 100}%`,
                transform: `translateX(-${(activeIndex * 100) / totalSlides}%)`,
              }}
            >
              {extendedFeatures.map((feature, index) => (
                <div
                  key={`${feature.id}-${index}`}
                  className="w-full flex-shrink-0"
                  style={{ width: `${100 / totalSlides}%` }}
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-black/5 h-[260px] flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-medium mb-1">{feature.title}</h3>
                        <p className="text-sm text-black/50">{feature.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-3xl serif text-[#FF9678]">{feature.stat}</div>
                        <div className="text-[10px] text-black/40 uppercase tracking-wider">{feature.statLabel}</div>
                      </div>
                    </div>
                    <div className="flex-1">
                      {renderCardContent(feature.id, index === activeIndex || (activeIndex === features.length && index === features.length))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Card (faded, partial) */}
        <div
          className="hidden md:block w-[320px] flex-shrink-0 opacity-40 scale-95 cursor-pointer transition-all duration-700 ease-out"
          onClick={() => goToSlide(next)}
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 h-[260px]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium mb-1">{features[next].title}</h3>
                <p className="text-xs text-black/50 line-clamp-2">{features[next].description}</p>
              </div>
            </div>
            <div className="h-[140px] flex items-center justify-center text-black/20">
              <span className="text-4xl serif">{features[next].stat}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Card content components (simplified versions for carousel)
const IntegrationCardContent = ({ isActive }: { isActive: boolean }) => {
  const [integrations, setIntegrations] = useState([
    { name: 'Stripe', status: 'connecting', connected: false },
    { name: 'PayPal', status: 'waiting', connected: false },
    { name: 'Wise', status: 'waiting', connected: false },
  ]);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const timeouts: NodeJS.Timeout[] = [];
    timeouts.push(setTimeout(() => {
      setIntegrations([
        { name: 'Stripe', status: 'connected', connected: true },
        { name: 'PayPal', status: 'connecting', connected: false },
        { name: 'Wise', status: 'waiting', connected: false },
      ]);
    }, 1500));
    timeouts.push(setTimeout(() => {
      setIntegrations([
        { name: 'Stripe', status: 'connected', connected: true },
        { name: 'PayPal', status: 'connected', connected: true },
        { name: 'Wise', status: 'connecting', connected: false },
      ]);
    }, 3000));
    timeouts.push(setTimeout(() => {
      setIntegrations([
        { name: 'Stripe', status: 'connected', connected: true },
        { name: 'PayPal', status: 'connected', connected: true },
        { name: 'Wise', status: 'connected', connected: true },
      ]);
    }, 4500));
    timeouts.push(setTimeout(() => {
      setIntegrations([
        { name: 'Stripe', status: 'connecting', connected: false },
        { name: 'PayPal', status: 'waiting', connected: false },
        { name: 'Wise', status: 'waiting', connected: false },
      ]);
      setCycle(c => c + 1);
    }, 7000));
    return () => timeouts.forEach(t => clearTimeout(t));
  }, [isActive, cycle]);

  return (
    <div className="bg-[#F5F2EA]/50 rounded-2xl p-4 space-y-2">
      {integrations.map((item, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {item.status === 'connecting' ? (
              <svg className="w-3 h-3 animate-spin text-[#FF9678]" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : (
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                item.connected ? 'bg-[#C8DFA8]' : 'bg-[#CCD7E4]'
              }`} />
            )}
            <span className="text-sm">{item.name}</span>
          </div>
          <span className={`text-xs transition-colors duration-300 ${
            item.connected ? 'text-[#C8DFA8]' : item.status === 'connecting' ? 'text-[#FF9678]' : 'text-black/30'
          }`}>
            {item.status === 'connecting' ? 'Connecting...' : item.connected ? 'Connected' : 'Waiting'}
          </span>
        </div>
      ))}
    </div>
  );
};

const PredictionCardContent = ({ isActive }: { isActive: boolean }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }
    const interval = setInterval(() => {
      setProgress(prev => prev >= 100 ? 0 : prev + 2);
    }, 50);
    return () => clearInterval(interval);
  }, [isActive]);

  const lineLength = 120 * (progress / 100);

  return (
    <div className="bg-[#F5F2EA]/50 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-black/40">Next 3 months</span>
        <span className="text-xs text-[#FF9678] font-medium">↑ Trending up</span>
      </div>
      <svg className="w-full h-16" viewBox="0 0 200 60" fill="none">
        <path d="M0 45 Q30 40 60 35 T120 25 T180 15 L200 10" stroke="#CCD7E4" strokeWidth="2" strokeDasharray="4 4" />
        <path
          d={`M0 45 Q30 40 60 35 T${Math.min(120, lineLength)} ${45 - (lineLength / 120) * 20}`}
          stroke="#FF9678"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {progress > 0 && (
          <circle cx={Math.min(120, lineLength)} cy={45 - (lineLength / 120) * 20} r="4" fill="#FF9678" />
        )}
      </svg>
      <div className="flex justify-between text-[10px] text-black/30 mt-1">
        <span>Now</span>
        <span>+3 months</span>
      </div>
    </div>
  );
};

const ClientCardContent = ({ isActive }: { isActive: boolean }) => {
  const [bars, setBars] = useState([0, 0, 0]);
  const [cycle, setCycle] = useState(0);
  const clients = [
    { name: 'Acme Inc', amount: '$12,400', pct: 85 },
    { name: 'TechCorp', amount: '$8,200', pct: 65 },
    { name: 'StartupXYZ', amount: '$4,100', pct: 40 },
  ];

  useEffect(() => {
    if (!isActive) {
      setBars([0, 0, 0]);
      return;
    }
    const timeouts: NodeJS.Timeout[] = [];
    timeouts.push(setTimeout(() => setBars([85, 0, 0]), 300));
    timeouts.push(setTimeout(() => setBars([85, 65, 0]), 600));
    timeouts.push(setTimeout(() => setBars([85, 65, 40]), 900));
    timeouts.push(setTimeout(() => {
      setBars([0, 0, 0]);
      setCycle(c => c + 1);
    }, 5000));
    return () => timeouts.forEach(t => clearTimeout(t));
  }, [isActive, cycle]);

  return (
    <div className="bg-[#F5F2EA]/50 rounded-2xl p-4 space-y-2">
      {clients.map((client, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>{client.name}</span>
            <span className="font-medium">{client.amount}</span>
          </div>
          <div className="h-1.5 bg-[#F5F2EA] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF9678] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${bars[i]}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const RateCardContent = ({ isActive }: { isActive: boolean }) => {
  const [heights, setHeights] = useState({ before: 0, after: 0 });
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setHeights({ before: 0, after: 0 });
      return;
    }
    const timeouts: NodeJS.Timeout[] = [];
    timeouts.push(setTimeout(() => setHeights({ before: 64, after: 0 }), 400));
    timeouts.push(setTimeout(() => setHeights({ before: 64, after: 96 }), 1000));
    timeouts.push(setTimeout(() => {
      setHeights({ before: 0, after: 0 });
      setCycle(c => c + 1);
    }, 5500));
    return () => timeouts.forEach(t => clearTimeout(t));
  }, [isActive, cycle]);

  return (
    <div className="bg-[#F5F2EA]/50 rounded-2xl p-4">
      <div className="flex items-end justify-between gap-4" style={{ height: '96px' }}>
        <div className="flex-1 flex flex-col">
          <div className="text-[10px] text-black/40 uppercase tracking-wider mb-2">Before</div>
          <div className="flex-1 flex items-end">
            <div
              className="w-full bg-[#CCD7E4]/50 rounded-lg flex items-end justify-center pb-2 transition-all duration-700 ease-out"
              style={{ height: `${heights.before}px` }}
            >
              {heights.before > 0 && <span className="text-lg font-semibold serif">$71</span>}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="text-[10px] text-black/40 uppercase tracking-wider mb-2">After</div>
          <div className="flex-1 flex items-end">
            <div
              className="w-full bg-[#FF9678]/20 rounded-lg flex items-end justify-center pb-2 border-2 border-[#FF9678]/30 transition-all duration-700 ease-out"
              style={{ height: `${heights.after}px` }}
            >
              {heights.after > 0 && <span className="text-lg font-semibold serif">$95</span>}
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-3 text-xs text-black/50">
        <span className="text-[#FF9678] font-medium">+34%</span> rate improvement
      </div>
    </div>
  );
};

// Section Divider with + markers, lines, and vertical gaps
const SectionDivider = () => (
  <div className="section-divider">
    <div className="section-divider-line-left" />
    <div className="vertical-gap-left" />
    <span className="plus-left" />
    <div className="section-divider-inner" />
    <span className="plus-right" />
    <div className="vertical-gap-right" />
    <div className="section-divider-line-right" />
  </div>
);

// Testimonials data
const testimonials = [
  {
    quote: "Finally, I can see exactly where my money comes from. Pulse paid for itself in the first week.",
    name: 'Sarah Chen',
    role: 'UI/UX Designer',
    avatar: 'SC',
  },
  {
    quote: "The income predictions are scary accurate. I planned my first vacation in 3 years.",
    name: 'Marcus Webb',
    role: 'Full-stack Developer',
    avatar: 'MW',
  },
  {
    quote: "I used to spend hours in spreadsheets. Now I open Pulse for 2 minutes and know everything.",
    name: 'Elena Rodriguez',
    role: 'Brand Consultant',
    avatar: 'ER',
  },
  {
    quote: "Pulse showed me that one client was eating 60% of my time for 20% of my revenue. Game changer.",
    name: 'James Okafor',
    role: 'Freelance Copywriter',
    avatar: 'JO',
  },
  {
    quote: "I raised my rates by $30/hr after seeing my real numbers. Best decision I made all year.",
    name: 'Anika Patel',
    role: 'Product Photographer',
    avatar: 'AP',
  },
  {
    quote: "My accountant asked what tool I was using. Now she recommends Pulse to all her freelance clients.",
    name: 'Tom Lindgren',
    role: 'Motion Designer',
    avatar: 'TL',
  },
];

// SVG Logo Components — real brand marks
const StripeLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
  </svg>
);
const PayPalLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86" />
    <path d="M22.177 10.199c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686" />
    <path d="M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z" />
  </svg>
);
const WiseLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M6.488 7.469 0 15.05h11.585l1.301-3.576H7.922l3.033-3.507.01-.092L8.993 4.48h8.873l-6.878 18.925h4.706L24 .595H2.543l3.945 6.874Z" />
  </svg>
);
const MercuryLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c1.85 0 3.55.63 4.9 1.69L7.69 16.9A7.95 7.95 0 0 1 4 12c0-4.42 3.58-8 8-8zm0 16c-1.85 0-3.55-.63-4.9-1.69L16.31 7.1A7.95 7.95 0 0 1 20 12c0 4.42-3.58 8-8 8z" />
  </svg>
);
const RevolutLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M20.9133 6.9566C20.9133 3.1208 17.7898 0 13.9503 0H2.424v3.8605h10.9782c1.7376 0 3.177 1.3651 3.2087 3.043.016.84-.2994 1.633-.8878 2.2324-.5886.5998-1.375.9303-2.2144.9303H9.2322a.2756.2756 0 0 0-.2755.2752v3.431c0 .0585.018.1142.052.1612L16.2646 24h5.3114l-7.2727-10.094c3.6625-.1838 6.61-3.2612 6.61-6.9494zM6.8943 5.9229H2.424V24h4.4704z" />
  </svg>
);
const SquareLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M4.01 0A4.01 4.01 0 000 4.01v15.98c0 2.21 1.8 4 4.01 4.01h15.98C22.2 24 24 22.2 24 19.99V4A4.01 4.01 0 0019.99 0H4zm1.62 4.36h12.74c.7 0 1.26.57 1.26 1.27v12.74c0 .7-.56 1.27-1.26 1.27H5.63c-.7 0-1.26-.57-1.26-1.27V5.63a1.27 1.27 0 011.26-1.27zm3.83 4.35a.73.73 0 00-.73.73v5.09c0 .4.32.72.72.72h5.1a.73.73 0 00.73-.72V9.44a.73.73 0 00-.73-.73h-5.1Z" />
  </svg>
);
const ShopifyLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023z" />
    <path d="M11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z" />
  </svg>
);
const GumroadLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0Zm-.007 5.12c4.48 0 5.995 3.025 6.064 4.744h-3.239c-.069-.962-.897-2.406-2.896-2.406-2.136 0-3.514 1.857-3.514 4.126 0 2.27 1.378 4.125 3.514 4.125 1.93 0 2.758-1.512 3.103-3.025h-3.103v-1.238h6.509v6.327h-2.855v-3.989c-.207 1.444-1.102 4.264-4.617 4.264-3.516 0-5.584-2.82-5.584-6.326 0-3.645 2.276-6.602 6.618-6.602z" />
  </svg>
);
const PaddleLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M2.363 7.904v.849a3.95 3.95 0 0 1 3.65 2.425c.198.476.3.987.299 1.502h.791c0-1.04.416-2.037 1.157-2.772a3.962 3.962 0 0 1 2.792-1.149V7.91a3.959 3.959 0 0 1-3.65-2.425 3.893 3.893 0 0 1-.299-1.502h-.791c0 1.04-.416 2.037-1.157 2.772a3.96 3.96 0 0 1-2.792 1.149M13.105 2.51H6.312V0h6.793c4.772 0 8.532 3.735 8.532 8.314 0 4.58-3.76 8.314-8.532 8.314H9.156V24H6.312v-9.882h6.793c3.319 0 5.688-2.352 5.688-5.804 0-3.451-2.37-5.804-5.688-5.804" />
  </svg>
);
const QuickBooksLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm.642 4.1335c.9554 0 1.7296.776 1.7296 1.7332v9.0667h1.6c1.614 0 2.9275-1.3156 2.9275-2.933 0-1.6173-1.3136-2.9333-2.9276-2.9333h-.6654V7.3334h.6654c2.5722 0 4.6577 2.0897 4.6577 4.667 0 2.5774-2.0855 4.6666-4.6577 4.6666H12.642zM7.9837 7.333h3.3291v12.533c-.9555 0-1.73-.7759-1.73-1.7332V9.0662H7.9837c-1.6146 0-2.9277 1.316-2.9277 2.9334 0 1.6175 1.3131 2.9333 2.9277 2.9333h.6654v1.7332h-.6654c-2.5725 0-4.6577-2.0892-4.6577-4.6665 0-2.5771 2.0852-4.6666 4.6577-4.6666Z" />
  </svg>
);
const FreshBooksLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12.8 2L4 5.6v12.8L12.8 22l8.8-3.6V5.6L12.8 2zm-.4 3.2l5.6 2.4v8L12.4 18l-5.6-2.4v-8l5.6-2.4zm0 2.8L9.2 9.6v4.8l3.2 1.6 3.2-1.6V9.6l-3.2-1.6z" />
  </svg>
);
const WaveLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M2 12c1.5-3 3-5 4.5-5S9.5 11 11 14s3 5 4.5 5 3-2 4.5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M2 16c1.5-3 3-5 4.5-5S9.5 15 11 18s3 3 4.5 3 3-2 4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
  </svg>
);

// Integration platforms — brand colors + logo components
const integrationPlatforms = [
  { name: 'Stripe', color: '#635BFF', Logo: StripeLogo },
  { name: 'PayPal', color: '#003087', Logo: PayPalLogo },
  { name: 'Wise', color: '#9FE870', Logo: WiseLogo },
  { name: 'Mercury', color: '#1C1C1E', Logo: MercuryLogo },
  { name: 'Revolut', color: '#0075EB', Logo: RevolutLogo },
  { name: 'Square', color: '#3E4348', Logo: SquareLogo },
  { name: 'Shopify', color: '#96BF48', Logo: ShopifyLogo },
  { name: 'Gumroad', color: '#FF90E8', Logo: GumroadLogo },
  { name: 'Paddle', color: '#3B3B3B', Logo: PaddleLogo },
  { name: 'QuickBooks', color: '#2CA01C', Logo: QuickBooksLogo },
  { name: 'FreshBooks', color: '#0075DD', Logo: FreshBooksLogo },
  { name: 'Wave', color: '#003DA5', Logo: WaveLogo },
];

// Marquee rows — colors distributed to avoid same-hue adjacency
const marqueeRow1 = [integrationPlatforms[0], integrationPlatforms[4], integrationPlatforms[8]];
const marqueeRow2 = [integrationPlatforms[1], integrationPlatforms[5], integrationPlatforms[9]];
const marqueeRow3 = [integrationPlatforms[2], integrationPlatforms[6], integrationPlatforms[10]];
const marqueeRow4 = [integrationPlatforms[3], integrationPlatforms[7], integrationPlatforms[11]];

// Integration card component — horizontal pill badge with colored dot
const IntegrationCard = ({ name, color }: { name: string; color: string; Logo: () => React.JSX.Element }) => (
  <div className="inline-flex items-center gap-2 bg-white border border-black/[0.08] rounded-full px-4 py-2 mx-1.5 flex-shrink-0">
    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
    <span className="text-sm font-medium text-black/60 whitespace-nowrap">{name}</span>
  </div>
);

// FAQ data
const faqs = [
  {
    question: 'Is my financial data secure?',
    answer: 'Absolutely. We use bank-level AES-256 encryption, and your credentials are never stored on our servers. All connections go through read-only OAuth tokens, so we can never move or modify your funds.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes — no contracts, no cancellation fees. You can downgrade to the free plan or cancel your subscription at any time from your account settings. Your data stays available for 30 days after cancellation.',
  },
  {
    question: 'Which platforms do you support?',
    answer: 'We currently support 12+ platforms including Stripe, PayPal, Wise, Mercury, Revolut, Square, Shopify, Gumroad, Paddle, QuickBooks, FreshBooks, and Wave. New integrations are added every month.',
  },
  {
    question: 'How does the free plan work?',
    answer: 'The free plan gives you 1 connected platform, basic revenue tracking, a monthly overview, and up to 50 transactions per month. No credit card required — just sign up and start tracking.',
  },
  {
    question: 'Do you offer team plans?',
    answer: 'Not yet, but team and agency plans are on our roadmap. If you need multi-user access today, reach out to us and we\'ll work something out.',
  },
];

// Editorial Testimonial Component - Large pull-quote with crossfade
const EditorialTestimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoAdvance = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      // Fade out
      setIsVisible(false);
      // After fade-out, switch content and fade in
      setTimeout(() => {
        setActiveIndex(prev => (prev + 1) % testimonials.length);
        setIsVisible(true);
      }, 400);
    }, 7000);
  }, []);

  useEffect(() => {
    startAutoAdvance();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoAdvance]);

  const goToSlide = (index: number) => {
    if (index === activeIndex) return;
    setIsVisible(false);
    setTimeout(() => {
      setActiveIndex(index);
      setIsVisible(true);
    }, 400);
    startAutoAdvance();
  };

  const testimonial = testimonials[activeIndex];

  return (
    <div className="relative max-w-2xl mx-auto px-4">
      {/* Quote block */}
      <div
        className="transition-all duration-500 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(6px)',
        }}
      >
        {/* Quote text with inline decorative mark */}
        <p className="text-center text-xl md:text-3xl lg:text-4xl serif italic leading-snug text-[#1A1A18]">
          <span className="text-[#FF9678]/30 not-italic">&ldquo;</span>{testimonial.quote}<span className="text-[#FF9678]/30 not-italic">&rdquo;</span>
        </p>

        {/* Author */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="w-9 h-9 rounded-full bg-[#FF9678] flex items-center justify-center text-white text-[11px] font-medium">
            {testimonial.avatar}
          </div>
          <div className="text-left">
            <div className="font-medium text-sm text-[#1A1A18]">{testimonial.name}</div>
            <div className="text-[11px] text-black/40">{testimonial.role}</div>
          </div>
        </div>
      </div>

    </div>
  );
};

// ===== Before Card =====
const BeforeCard = () => (
  <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-sm w-full">
    <div className="flex items-center justify-between mb-5">
      <span className="text-sm font-medium text-black/40">Your current setup</span>
      <span className="text-[10px] font-medium uppercase tracking-wider text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Overdue</span>
    </div>

    {/* Scattered receipt snippets */}
    <div className="relative h-[200px] overflow-hidden">
      {/* Receipt 1 */}
      <div className="absolute top-2 left-2 bg-[#F5F2EA] rounded-lg p-3 w-[140px] shadow-sm border border-black/[0.04]" style={{ transform: 'rotate(-3deg)' }}>
        <div className="text-[9px] text-black/30 uppercase tracking-wider mb-1">Invoice #047</div>
        <div className="text-lg serif text-black/20">$???</div>
        <div className="mt-2 h-[1px] bg-black/[0.06]" />
        <div className="text-[8px] text-red-400 mt-1">Missing</div>
      </div>

      {/* Receipt 2 */}
      <div className="absolute top-4 right-0 bg-[#F5F2EA] rounded-lg p-3 w-[130px] shadow-sm border border-black/[0.04]" style={{ transform: 'rotate(2deg)' }}>
        <div className="text-[9px] text-black/30 uppercase tracking-wider mb-1">Payment</div>
        <div className="text-lg serif">$1,200</div>
        <div className="mt-2 h-[1px] bg-black/[0.06]" />
        <div className="text-[8px] text-black/30 mt-1">Uncategorized</div>
      </div>

      {/* Mini spreadsheet */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#F5F2EA] rounded-lg p-2 w-[180px] shadow-sm border border-black/[0.04]" style={{ transform: 'rotate(1deg)' }}>
        <div className="grid grid-cols-3 gap-[1px]">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-3 bg-white/80 rounded-[2px]" />
          ))}
        </div>
        <div className="text-[8px] text-red-400 mt-2 text-right">Last updated: 3 weeks ago</div>
      </div>

      {/* Floating question marks */}
      <div className="absolute top-12 left-[45%] text-xl serif text-black/[0.06] select-none" style={{ transform: 'rotate(15deg)' }}>?</div>
      <div className="absolute bottom-16 right-6 text-lg serif text-black/[0.06] select-none" style={{ transform: 'rotate(-10deg)' }}>?</div>
    </div>
  </div>
);

// ===== After Card =====
const AfterCard = () => (
  <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-sm w-full">
    <div className="flex items-center justify-between mb-5">
      <span className="text-sm font-medium">October Overview</span>
      <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Updated: Just now</span>
    </div>

    {/* Revenue header */}
    <div className="mb-5">
      <div className="text-[10px] text-black/40 uppercase tracking-wider mb-1">Total Revenue</div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl serif">$12,400</span>
        <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">+22%</span>
      </div>
    </div>

    {/* Stat pills */}
    <div className="flex flex-wrap gap-2 mb-5">
      {[
        { label: 'Avg Rate', value: '$95/hr' },
        { label: 'Clients', value: '6' },
        { label: 'On-time', value: '98%' },
      ].map((stat) => (
        <div key={stat.label} className="flex items-center gap-1.5 bg-[#F5F2EA] rounded-full px-3 py-1.5">
          <span className="text-[10px] text-black/40">{stat.label}</span>
          <span className="text-xs font-semibold">{stat.value}</span>
        </div>
      ))}
    </div>

    {/* Mini bar chart */}
    <div className="flex items-end gap-1.5 h-16">
      {[40, 55, 70, 45, 80, 65, 90, 75, 85, 60, 95, 88].map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-[#FF9678] rounded-sm"
          style={{ height: `${h}%`, opacity: i > 9 ? 0.4 : 1 }}
        />
      ))}
    </div>
    <div className="flex justify-between mt-1.5 text-[9px] text-black/30">
      <span>Jan</span>
      <span>Jun</span>
      <span>Oct</span>
    </div>
  </div>
);

// ===== Before/After Section =====
const BeforeAfterSection = () => {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <section className="py-12">
      <ScrollFadeUp>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white border border-black/10 rounded-full px-3 py-1.5 text-xs mb-4">
            <svg className="w-3.5 h-3.5 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg> Transformation
          </div>
          <h2 className="text-4xl md:text-5xl serif mb-4">
            From chaos to <span className="italic text-[#FF9678]">clarity</span>
          </h2>

          {/* Toggle */}
          <div className="flex justify-center mt-6">
            <div className="relative flex h-9 items-center rounded-full border border-black/10 bg-[#F5F2EA] p-0.5">
              {['Before', 'After'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setShowAfter(tab === 'After')}
                  className="relative z-[1] flex h-8 items-center justify-center px-5 cursor-pointer"
                >
                  {((tab === 'After' && showAfter) || (tab === 'Before' && !showAfter)) && (
                    <div className="absolute inset-0 rounded-full bg-white border border-black/[0.06] shadow-sm" />
                  )}
                  <span className={`relative text-sm font-medium transition-colors duration-200 ${
                    (tab === 'After' && showAfter) || (tab === 'Before' && !showAfter) ? 'text-[#1A1A18]' : 'text-black/40'
                  }`}>
                    {tab}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card container — fixed height, absolute positioned cards */}
        <div className="max-w-lg mx-auto relative" style={{ minHeight: 340 }}>
          <div className={`absolute inset-0 ba-card ${showAfter ? 'ba-card-exit-left' : 'ba-card-enter'}`} style={{ pointerEvents: showAfter ? 'none' : 'auto' }}>
            <BeforeCard />
          </div>
          <div className={`absolute inset-0 ba-card ${showAfter ? 'ba-card-enter' : 'ba-card-exit-right'}`} style={{ pointerEvents: showAfter ? 'auto' : 'none' }}>
            <AfterCard />
          </div>
        </div>
      </ScrollFadeUp>
    </section>
  );
};

// ===== ROI Calculator Section =====
const ROICalculatorSection = () => {
  const [rate, setRate] = useState(75);
  const [hours, setHours] = useState(30);

  const annualRevenue = rate * hours * 50;
  const undercharged = Math.round(annualRevenue * 0.08);
  const latePay = Math.round(annualRevenue * 0.035);
  const taxSavings = Math.round(annualRevenue * 0.05);
  const totalFound = undercharged + latePay + taxSavings;

  return (
    <section className="py-12">
      <ScrollFadeUp>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white border border-black/10 rounded-full px-3 py-1.5 text-xs mb-4">
            <svg className="w-3.5 h-3.5 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg> Revenue Intelligence
          </div>
          <h2 className="text-4xl md:text-5xl serif mb-4">
            See your <span className="italic text-[#FF9678]">hidden</span> revenue
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Left — Input card */}
          <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-sm">
            <h3 className="text-lg font-medium mb-6">Your numbers</h3>

            {/* Hourly rate slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-black/60">Hourly rate</label>
                <span className="text-sm font-semibold serif">${rate}</span>
              </div>
              <input
                type="range"
                min={25}
                max={300}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="roi-slider"
              />
              <div className="flex justify-between text-[10px] text-black/30 mt-1">
                <span>$25</span>
                <span>$300</span>
              </div>
            </div>

            {/* Weekly hours slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-black/60">Hours per week</label>
                <span className="text-sm font-semibold serif">{hours}h</span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="roi-slider"
              />
              <div className="flex justify-between text-[10px] text-black/30 mt-1">
                <span>5h</span>
                <span>60h</span>
              </div>
            </div>
          </div>

          {/* Right — Results card */}
          <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-sm">
            <div className="text-[10px] text-black/40 uppercase tracking-wider mb-1">Annual revenue</div>
            <div className="text-4xl serif mb-6">
              <AnimatedNumber value={annualRevenue} />
            </div>

            <div className="space-y-3 mb-6">
              {[
                { label: 'Undercharged hours', value: undercharged, icon: '~8%' },
                { label: 'Late payment costs', value: latePay, icon: '~3.5%' },
                { label: 'Tax savings missed', value: taxSavings, icon: '~5%' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-black/[0.04]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-black/30 bg-[#F5F2EA] rounded-full px-1.5 py-0.5 font-medium">{row.icon}</span>
                    <span className="text-sm text-black/60">{row.label}</span>
                  </div>
                  <span className="text-sm font-semibold serif">
                    <AnimatedNumber value={row.value} />
                  </span>
                </div>
              ))}
            </div>

            {/* Total highlight */}
            <div className="bg-[#FF9678]/10 rounded-xl p-4">
              <div className="text-[10px] text-black/40 uppercase tracking-wider mb-1">Pulse could find you</div>
              <div className="text-2xl serif text-[#FF9678]">
                <AnimatedNumber value={totalFound} />
                <span className="text-sm font-normal text-black/40">/year</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollFadeUp>
    </section>
  );
};

export default function HomePage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [integrationsVisible, setIntegrationsVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navBadgeIndex, setNavBadgeIndex] = useState(0);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const integrationsRef = useRef<HTMLDivElement>(null);

  // Preloader — dismiss after animation completes
  useEffect(() => {
    const timer = setTimeout(() => setPreloaderDone(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const el = integrationsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntegrationsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  // Cycle nav badge: Beta → No credit card → 2,400+ freelancers
  useEffect(() => {
    const interval = setInterval(() => {
      setNavBadgeIndex(prev => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="relative min-h-screen bg-[#F5F2EA]">
      {/* Preloader */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#F5F2EA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          opacity: preloaderDone ? 0 : 1,
          visibility: preloaderDone ? 'hidden' as const : 'visible' as const,
          transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), visibility 0.6s',
          pointerEvents: preloaderDone ? 'none' as const : 'auto' as const,
        }}
      >
        <div style={{ position: 'relative' }}>
          <span className="serif" style={{ fontSize: 'clamp(48px, 10vw, 72px)', letterSpacing: '-0.04em' }}>
            {'Pulse'.split('').map((letter, i) => (
              <span
                key={i}
                className="preloader-letter"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {letter}
              </span>
            ))}
          </span>
          <span className="preloader-underline" style={{ marginTop: 8 }} />
        </div>
        <div className="preloader-dot" style={{ marginTop: 24 }} />
      </div>

      {/* Edge Lines - vertical lines on left and right */}
      <div className="edge-lines" />

      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white border border-black/10 rounded-full w-[calc(100vw-48px)] sm:w-[calc(100vw-64px)] lg:w-auto px-5 sm:px-6 lg:px-6 py-3 flex items-center gap-4 lg:gap-8 shadow-sm">
          <Link href="/" className="text-xl serif">Pulse</Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6 text-sm">
            <a href="#features" className="text-black/60 hover:text-black transition-colors">Features</a>
            <a href="#how-it-works" className="text-black/60 hover:text-black transition-colors">How it works</a>
            <a href="#pricing" className="text-black/60 hover:text-black transition-colors">Pricing</a>
          </div>

          {/* Desktop CTA */}
          <Link
            href="/onboarding"
            className="hidden lg:inline-flex bg-[#1A1A18] text-white text-sm px-4 py-2 rounded-full hover:bg-[#2a2a28] transition-colors"
          >
            Get started
          </Link>

          {/* Left spacer — mobile/tablet only */}
          <div className="flex-1 lg:hidden" />

          {/* Cycling badge — centered in pill on mobile/tablet */}
          <div className="lg:hidden relative overflow-hidden h-6 min-w-[120px] flex items-center justify-center">
            {/* Beta */}
            <div
              className="absolute inset-0 flex items-center justify-center gap-1.5 transition-all duration-500 ease-out"
              style={{
                opacity: navBadgeIndex === 0 ? 1 : 0,
                transform: navBadgeIndex === 0 ? 'translateY(0)' : navBadgeIndex > 0 ? 'translateY(-100%)' : 'translateY(100%)',
              }}
            >
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-medium text-black/40 uppercase tracking-wider">Beta</span>
            </div>
            {/* No credit card */}
            <div
              className="absolute inset-0 flex items-center justify-center gap-1.5 transition-all duration-500 ease-out"
              style={{
                opacity: navBadgeIndex === 1 ? 1 : 0,
                transform: navBadgeIndex === 1 ? 'translateY(0)' : navBadgeIndex > 1 ? 'translateY(-100%)' : 'translateY(100%)',
              }}
            >
              <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="text-[10px] font-medium text-black/40 tracking-wide">No credit card</span>
            </div>
            {/* Social proof */}
            <div
              className="absolute inset-0 flex items-center justify-center gap-1.5 transition-all duration-500 ease-out"
              style={{
                opacity: navBadgeIndex === 2 ? 1 : 0,
                transform: navBadgeIndex === 2 ? 'translateY(0)' : navBadgeIndex < 2 ? 'translateY(100%)' : 'translateY(-100%)',
              }}
            >
              <div className="flex -space-x-1">
                {['SC', 'MW', 'ER'].map((initials, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full bg-[#FF9678] flex items-center justify-center text-[6px] font-medium text-white border border-[#F5F2EA]"
                    style={{ zIndex: 3 - i }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-medium text-black/40 tracking-wide">2,400+</span>
            </div>
          </div>

          {/* Right spacer — mobile/tablet only */}
          <div className="flex-1 lg:hidden" />

          {/* Hamburger — mobile/tablet */}
          <button
            onClick={toggleMenu}
            className="lg:hidden relative w-8 h-8 bg-[#1A1A18] rounded-full flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <span
              className="hamburger-bar"
              style={{
                top: menuOpen ? '50%' : '35%',
                transform: menuOpen
                  ? 'translate(-50%, -50%) rotate(45deg)'
                  : 'translate(-50%, -50%) rotate(0deg)',
              }}
            />
            <span
              className="hamburger-bar"
              style={{
                top: menuOpen ? '50%' : '65%',
                transform: menuOpen
                  ? 'translate(-50%, -50%) rotate(-45deg)'
                  : 'translate(-50%, -50%) rotate(0deg)',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Full-screen menu overlay — mobile/tablet */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 menu-overlay" style={{ backgroundColor: 'rgba(245,242,234,0.97)', backdropFilter: 'blur(8px)' }}>
          {/* Edge lines visible through overlay */}
          <div className="edge-lines" />

          <div className="flex flex-col items-center justify-center h-full gap-2">
            {/* Nav links — large serif */}
            {[
              { label: 'Features', href: '#features' },
              { label: 'How it works', href: '#how-it-works' },
              { label: 'Pricing', href: '#pricing' },
            ].map((item, i) => (
              <a
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="menu-overlay-item text-4xl md:text-5xl serif text-[#1A1A18] py-3 hover:text-[#FF9678] transition-colors duration-300"
                style={{ animationDelay: `${100 + i * 80}ms` }}
              >
                {item.label}
              </a>
            ))}

            {/* Thin rule */}
            <div
              className="menu-overlay-item w-12 h-[1px] bg-black/10 my-4"
              style={{ animationDelay: '340ms' }}
            />

            {/* CTA button */}
            <Link
              href="/onboarding"
              onClick={closeMenu}
              className="menu-overlay-item inline-flex items-center gap-2 bg-[#1A1A18] text-white px-8 py-4 rounded-full font-medium hover:bg-[#2a2a28] transition-colors"
              style={{ animationDelay: '400ms' }}
            >
              Get started
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Subtle footer text */}
            <p
              className="menu-overlay-item absolute bottom-8 text-[11px] text-black/20"
              style={{ animationDelay: '480ms' }}
            >
              No credit card required
            </p>
          </div>
        </div>
      )}

      <main className="relative z-10 max-w-6xl mx-auto px-7">

        {/* ===== HERO SECTION ===== */}
        <section className="pt-28 pb-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text + CTAs */}
            <div>
              <div className="hidden lg:inline-flex items-center gap-2 bg-white border border-black/10 rounded-full px-3 py-1.5 text-xs mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Now in Beta
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl serif leading-[1.05] mb-6">
                The better way to<br />
                <span className="italic text-[#FF9678]">track your</span><br />
                freelance <span className="text-[#FF9678]">income</span>
              </h1>

              <p className="text-lg text-black/60 mb-8 max-w-md">
                A fully customizable revenue tracker for freelancers, agencies, and independent professionals who want clarity on their finances.
              </p>

              <div className="flex flex-row gap-3">
                <SwapCTA href="/onboarding" defaultText="Start free trial" revealText="No credit card" variant="primary" />
                <SwapCTA href="/dashboard" defaultText="View demo" revealText="See it live" variant="secondary" />
              </div>

            </div>

            {/* Right: Dashboard Preview */}
            <div className="card p-6">
              {/* Mini dashboard mockup */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#FF9678] rounded-full flex items-center justify-center text-white text-xs font-medium">
                    JD
                  </div>
                  <span className="text-sm font-medium">John Doe</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-black/40">Live</span>
                </div>
              </div>

              <div className="bg-[#F5F2EA] rounded-xl p-4 mb-4">
                <div className="text-xs text-black/40 uppercase tracking-wider mb-1">This Month</div>
                <div className="text-4xl serif">$8,420</div>
                <div className="text-sm text-green-600 mt-1">↑ 18.2% from last month</div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#F5F2EA] rounded-xl p-4">
                  <div className="text-xs text-black/40 uppercase tracking-wider mb-1">Predicted</div>
                  <div className="text-2xl serif">$9,200</div>
                </div>
                <div className="bg-[#F5F2EA] rounded-xl p-4">
                  <div className="text-xs text-black/40 uppercase tracking-wider mb-1">Clients</div>
                  <div className="text-2xl serif">4</div>
                </div>
              </div>

              {/* Mini chart */}
              <div className="h-24 flex items-end gap-1.5">
                {[40, 55, 45, 70, 60, 85, 75, 90, 80, 95, 85, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[#FF9678]/20 hover:bg-[#FF9678]/40 rounded-t transition-colors"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== TRUSTED BY ===== */}
        <SectionDivider />
        <ScrollFadeUp>
        <section className="py-8">
          <p className="text-center text-xs text-black/40 uppercase tracking-wider mb-6">
            Works with your favorite platforms
          </p>
          <Marquee
            gradient={true}
            gradientColor="#F5F2EA"
            gradientWidth={100}
            speed={40}
            pauseOnHover={true}
            autoFill={true}
          >
            {integrationPlatforms.slice(0, 9).map(({ name, Logo }) => (
              <span key={name} className="inline-flex items-center gap-2 text-black/25 mx-5 sm:mx-8 md:mx-12">
                <Logo />
                <span className="text-base font-semibold tracking-tight">{name}</span>
              </span>
            ))}
          </Marquee>
        </section>
        </ScrollFadeUp>

        {/* ===== HOW IT WORKS ===== */}
        <SectionDivider />
        <ScrollFadeUp>
        <section id="how-it-works" className="py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white border border-black/10 rounded-full px-3 py-1.5 text-xs mb-4">
              <svg className="w-3.5 h-3.5 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" /></svg> How it works
            </div>
            <h2 className="text-4xl md:text-5xl serif">
              Get started in minutes
            </h2>
            <p className="text-black/50 mt-4 max-w-lg mx-auto">
              Effortless revenue tracking for freelancers and agencies. Connect once, track forever.
            </p>

            {/* CTAs */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 bg-[#1A1A18] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#2a2a28] transition-colors"
              >
                Get started
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-white border border-black/10 px-5 py-2.5 rounded-full text-sm font-medium hover:border-black/20 transition-colors"
              >
                Book a demo
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Connect - Orbital Connection Style */}
            <div className="card p-6 group transition-all duration-300 stagger-child">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-[#F5F2EA] rounded-lg text-xs font-medium mb-4">
                01
              </div>
              <h3 className="text-xl font-medium mb-2">Connect your accounts</h3>
              <p className="text-sm text-black/50">We&apos;ll handle all the cross-referencing, so you don&apos;t have to worry about missing payments.</p>

              {/* Premium Orbital Illustration */}
              <div className="relative h-44 mt-6 flex items-center justify-center">
                {/* Orbital rings */}
                <div className="absolute w-32 h-32 rounded-full border border-[#FF9678]/20" />
                <div className="absolute w-44 h-44 rounded-full border border-[#FF9678]/10" />

                {/* Center Sync Icon */}
                <div className="relative z-10 w-12 h-12 bg-[#1A1A18] rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white animate-spin-slow" style={{ animationDuration: '8s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 16h5v5" />
                  </svg>
                </div>

                {/* Orbiting Platform Icons */}
                <div className="absolute w-32 h-32 animate-orbit" style={{ animationDuration: '20s' }}>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-lg shadow-md border border-black/5 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-[#1A1A18]">Stripe</span>
                  </div>
                </div>

                <div className="absolute w-32 h-32 animate-orbit" style={{ animationDuration: '20s', animationDelay: '-5s' }}>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-lg shadow-md border border-black/5 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-[#1A1A18]">PayPal</span>
                  </div>
                </div>

                <div className="absolute w-32 h-32 animate-orbit" style={{ animationDuration: '20s', animationDelay: '-10s' }}>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-lg shadow-md border border-black/5 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-[#1A1A18]">Wise</span>
                  </div>
                </div>

                <div className="absolute w-32 h-32 animate-orbit" style={{ animationDuration: '20s', animationDelay: '-15s' }}>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-lg shadow-md border border-black/5 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-[#1A1A18]">Bank</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Track - Revenue Chart */}
            <div className="card p-6 group transition-all duration-300 stagger-child">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-[#F5F2EA] rounded-lg text-xs font-medium mb-4">
                02
              </div>
              <h3 className="text-xl font-medium mb-2">Track your income</h3>
              <p className="text-sm text-black/50">See all your payments in one place with automatic categorization by client.</p>

              {/* Premium Chart Illustration */}
              <div className="mt-6 bg-[#F5F2EA]/50 rounded-2xl p-4">
                {/* Chart Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[10px] text-black/40 uppercase tracking-wider">This month</div>
                    <div className="text-2xl font-semibold serif">$8,420</div>
                  </div>
                  <div className="text-xs text-[#FF9678] font-medium bg-[#FF9678]/10 px-2 py-1 rounded-full">
                    ↑ 18%
                  </div>
                </div>

                {/* Mini Bar Chart */}
                <div className="flex items-end justify-between gap-1.5 h-20">
                  {[45, 62, 38, 75, 55, 82, 68, 90, 72, 85, 78, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-[#FF9678] rounded-sm transition-all duration-300 group-hover:bg-[#FF9678]/80"
                      style={{
                        height: `${h}%`,
                        opacity: i < 9 ? 1 : 0.4,
                      }}
                    />
                  ))}
                </div>

                {/* Chart Labels */}
                <div className="flex justify-between mt-2 text-[9px] text-black/30">
                  <span>Jan</span>
                  <span>Jun</span>
                  <span>Dec</span>
                </div>
              </div>
            </div>

            {/* Card 3: Insights - Analytics Dashboard */}
            <div className="card p-6 group transition-all duration-300 stagger-child">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-[#F5F2EA] rounded-lg text-xs font-medium mb-4">
                03
              </div>
              <h3 className="text-xl font-medium mb-2">Get insights</h3>
              <p className="text-sm text-black/50">Predict your income, optimize your rates, and understand your most valuable clients.</p>

              {/* Premium Analytics Illustration */}
              <div className="mt-6 space-y-3">
                {/* Prediction Ring */}
                <div className="bg-[#F5F2EA]/50 rounded-2xl p-4 flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#F5F2EA" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="40" fill="none" stroke="#FF9678" strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="251"
                        strokeDashoffset="63"
                        className="animate-progress"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-semibold">75%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-black/40 uppercase tracking-wider">Goal progress</div>
                    <div className="text-lg font-semibold serif">$9,200</div>
                    <div className="text-[10px] text-black/40">predicted this month</div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#F5F2EA]/50 rounded-xl p-3">
                    <div className="text-[10px] text-black/40 uppercase tracking-wider">Avg. rate</div>
                    <div className="text-lg font-semibold serif">$95<span className="text-xs font-normal text-black/40">/hr</span></div>
                  </div>
                  <div className="bg-[#F5F2EA]/50 rounded-xl p-3">
                    <div className="text-[10px] text-black/40 uppercase tracking-wider">Top client</div>
                    <div className="text-lg font-semibold serif truncate">Acme</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollFadeUp>

        {/* ===== BEFORE/AFTER ===== */}
        <SectionDivider />
        <BeforeAfterSection />

        {/* ===== FEATURES ===== */}
        <SectionDivider />
        <ScrollFadeUp>
        <section id="features" className="py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white border border-black/10 rounded-full px-3 py-1.5 text-xs mb-4">
              <svg className="w-3.5 h-3.5 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg> Features
            </div>
            <h2 className="text-4xl md:text-5xl serif mb-4">
              Everything you need
            </h2>
            <p className="text-black/50 max-w-lg mx-auto">
              Powerful tools to track, predict, and optimize your freelance income.
            </p>
          </div>

          {/* Cal.com style feature carousel */}
          <FeatureCarousel />
        </section>
        </ScrollFadeUp>

        {/* ===== ROI CALCULATOR ===== */}
        <SectionDivider />
        <ROICalculatorSection />

        {/* ===== TESTIMONIALS ===== */}
        <SectionDivider />
        <ScrollFadeUp>
        <section className="py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white border border-black/10 rounded-full px-3 py-1.5 text-xs mb-4">
              <svg className="w-3.5 h-3.5 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg> Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl serif">
              Don&apos;t just take our word for it
            </h2>
            <p className="text-black/50 mt-4">
              Our users are our best ambassadors.
            </p>
          </div>

          <EditorialTestimonial />
        </section>
        </ScrollFadeUp>

        {/* ===== PRICING ===== */}
        <SectionDivider />
        <ScrollFadeUp>
        <section id="pricing" className="py-12">
          <div className="mb-10">
            <div className="max-w-xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white border border-black/10 rounded-full px-3 py-1.5 text-xs mb-4">
                <svg className="w-3.5 h-3.5 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" /></svg> Pricing
              </div>
              <h2 className="text-4xl md:text-5xl serif tracking-tight text-balance">
                Pricing that scales with you
              </h2>
              <p className="text-black/50 mt-4 text-balance">
                Whichever plan you pick, it&apos;s free until you love your dashboard. That&apos;s our promise.
              </p>
            </div>
          </div>

          {/* Toggle — Eldora pill tabs */}
          <div className="relative mb-10">
            <div className="flex justify-center">
              <div className="relative flex h-9 items-center rounded-full border border-black/10 bg-[#F5F2EA] p-0.5">
                {['monthly', 'yearly'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setIsAnnual(tab === 'yearly')}
                    className="relative z-[1] flex h-8 items-center justify-center px-4 cursor-pointer"
                  >
                    {((tab === 'yearly' && isAnnual) || (tab === 'monthly' && !isAnnual)) && (
                      <div className="absolute inset-0 rounded-full bg-white border border-black/[0.06] shadow-sm" />
                    )}
                    <span className={`relative text-sm font-medium transition-colors duration-200 ${
                      (tab === 'yearly' && isAnnual) || (tab === 'monthly' && !isAnnual) ? 'text-[#1A1A18]' : 'text-black/40'
                    }`}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      {tab === 'yearly' && (
                        <span className="ml-2 rounded-full bg-[#FF9678]/15 px-1.5 py-0.5 text-xs font-semibold text-[#FF9678]">
                          -20%
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards — 3-column Eldora grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Free',
                price: '$0',
                yearlyPrice: '$0',
                period: 'forever',
                description: 'Perfect for getting started',
                buttonText: 'Get started',
                buttonStyle: 'bg-[#F5F2EA] text-[#1A1A18] hover:bg-[#ebe8e0]',
                popular: false,
                features: ['1 payment platform', 'Basic revenue tracking', 'Monthly overview', '50 transactions/month'],
              },
              {
                name: 'Pro',
                price: '$12',
                yearlyPrice: '$120',
                period: isAnnual ? 'year' : 'month',
                description: 'For serious freelancers',
                buttonText: 'Start free trial',
                buttonStyle: 'bg-[#FF9678] text-white hover:bg-[#f0845f] shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)]',
                popular: true,
                features: ['Unlimited platforms', 'Income predictions', 'Client analytics', 'Rate optimization', 'CSV & PDF export', 'Priority support'],
                inherits: 'Free',
              },
              {
                name: 'Team',
                price: '$29',
                yearlyPrice: '$290',
                period: isAnnual ? 'year' : 'month',
                description: 'For agencies & studios',
                buttonText: 'Contact sales',
                buttonStyle: 'bg-[#1A1A18] text-white hover:bg-[#2a2a28]',
                popular: false,
                features: ['Up to 5 team members', 'Team dashboard', 'Client portal', 'API access'],
                inherits: 'Pro',
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`relative grid grid-rows-[auto_auto_1fr] rounded-2xl stagger-child ${
                  tier.name === 'Team' ? 'hidden lg:grid' : ''
                } ${
                  tier.popular
                    ? 'bg-[#1A1A18] text-white shadow-[0px_34px_20px_-8px_rgba(0,0,0,0.05),0px_15px_15px_-6px_rgba(0,0,0,0.09),0px_4px_8px_-2px_rgba(0,0,0,0.10)]'
                    : 'bg-white border border-black/[0.06]'
                }`}
              >
                {/* Tier header */}
                <div className="flex flex-col gap-4 p-6">
                  <p className="text-sm">
                    {tier.name}
                    {tier.popular && (
                      <span className="ml-2 inline-flex h-6 items-center rounded-full bg-[#FF9678] px-2.5 text-xs font-medium text-white shadow-sm">
                        Popular
                      </span>
                    )}
                  </p>
                  <div className="mt-1 flex items-baseline">
                    <span
                      key={isAnnual ? tier.yearlyPrice : tier.price}
                      className="text-4xl font-semibold serif transition-all duration-300"
                    >
                      {isAnnual ? tier.yearlyPrice : tier.price}
                    </span>
                    <span className={`ml-2 text-sm ${tier.popular ? 'text-white/50' : 'text-black/40'}`}>
                      /{tier.period}
                    </span>
                  </div>
                  <p className={`text-sm ${tier.popular ? 'text-white/60' : 'text-black/50'}`}>{tier.description}</p>
                </div>

                {/* CTA button */}
                <div className="px-6 pb-4">
                  <Link
                    href="/onboarding"
                    className={`flex h-10 w-full items-center justify-center rounded-full text-sm font-medium tracking-wide transition-all active:scale-[0.97] ${tier.buttonStyle}`}
                  >
                    {tier.buttonText}
                  </Link>
                </div>

                {/* Divider */}
                <hr className={tier.popular ? 'border-white/10' : 'border-black/[0.06]'} />

                {/* Features */}
                <div className="p-6">
                  {tier.inherits && (
                    <p className={`mb-4 text-sm ${tier.popular ? 'text-white/50' : 'text-black/40'}`}>
                      Everything in {tier.inherits} +
                    </p>
                  )}
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5">
                        <div className={`flex w-5 h-5 items-center justify-center rounded-full border ${
                          tier.popular ? 'border-white/20 bg-white/10' : 'border-black/10'
                        }`}>
                          <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                            <path
                              d="M1.5 3.48828L3.375 5.36328L6.5 0.988281"
                              stroke={tier.popular ? '#fff' : '#1A1A18'}
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <span className={`text-sm ${tier.popular ? 'text-white/80' : 'text-black/70'}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
        </ScrollFadeUp>

        {/* ===== INTEGRATIONS ===== */}
        <SectionDivider />
        <ScrollFadeUp>
        <section className="py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white border border-black/10 rounded-full px-3 py-1.5 text-xs mb-4">
              <svg className="w-3.5 h-3.5 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg> Integrations
            </div>
            <h2 className="text-4xl md:text-5xl serif">
              Works with your entire stack
            </h2>
          </div>

          {/* Animated marquee grid — Eldora UI inspired */}
          <div
            ref={integrationsRef}
            className={`relative overflow-hidden py-4 ${integrationsVisible ? 'integrations-visible' : ''}`}
          >
            {/* Row 1 — left, speed 25 */}
            <Marquee speed={25} autoFill pauseOnHover gradient={false} className="mb-3">
              {marqueeRow1.map((platform, idx) => (
                <div key={platform.name} className="integration-card" style={{ animationDelay: `${100 + idx * 180}ms` }}>
                  <IntegrationCard {...platform} />
                </div>
              ))}
            </Marquee>

            {/* Row 2 — right, speed 35 */}
            <Marquee speed={35} direction="right" autoFill pauseOnHover gradient={false} className="mb-3">
              {marqueeRow2.map((platform, idx) => (
                <div key={platform.name} className="integration-card" style={{ animationDelay: `${280 + idx * 180}ms` }}>
                  <IntegrationCard {...platform} />
                </div>
              ))}
            </Marquee>

            {/* Row 3 — left, speed 20 */}
            <Marquee speed={20} autoFill pauseOnHover gradient={false} className="mb-3">
              {marqueeRow3.map((platform, idx) => (
                <div key={platform.name} className="integration-card" style={{ animationDelay: `${460 + idx * 180}ms` }}>
                  <IntegrationCard {...platform} />
                </div>
              ))}
            </Marquee>

            {/* Row 4 — right, speed 30 */}
            <Marquee speed={30} direction="right" autoFill pauseOnHover gradient={false}>
              {marqueeRow4.map((platform, idx) => (
                <div key={platform.name} className="integration-card" style={{ animationDelay: `${640 + idx * 180}ms` }}>
                  <IntegrationCard {...platform} />
                </div>
              ))}
            </Marquee>

            {/* Bottom gradient fade — cream depth effect */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none z-10"
              style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(245,242,234,0.6) 50%, #F5F2EA 100%)' }}
            />
            {/* Left edge fade */}
            <div
              className="absolute top-0 bottom-0 left-0 w-16 md:w-24 pointer-events-none z-10"
              style={{ background: 'linear-gradient(to right, #F5F2EA 0%, transparent 100%)' }}
            />
            {/* Right edge fade */}
            <div
              className="absolute top-0 bottom-0 right-0 w-16 md:w-24 pointer-events-none z-10"
              style={{ background: 'linear-gradient(to left, #F5F2EA 0%, transparent 100%)' }}
            />
          </div>

          <p className="text-center text-sm text-black/40 mt-8">
            More integrations added every month
          </p>
        </section>
        </ScrollFadeUp>

        {/* ===== FAQ ===== */}
        <SectionDivider />
        <ScrollFadeUp>
        <section className="py-14">
          {/* Editorial header — left-aligned with decorative number */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="flex items-start gap-6 md:gap-10">
              <div className="hidden md:block">
                <span className="text-[120px] leading-[0.8] serif text-[#FF9678]/[0.08] select-none">?</span>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-white border border-black/10 rounded-full px-3 py-1.5 text-xs mb-5">
                  <svg className="w-3.5 h-3.5 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg> FAQ
                </div>
                <h2 className="text-4xl md:text-5xl serif mb-4">
                  Questions &amp;<br />
                  <span className="italic">answers</span>
                </h2>
                <p className="text-black/40 text-sm max-w-sm">
                  Everything you need to know before getting started. Can&apos;t find your answer? <a href="mailto:hello@getpulse.io" className="text-[#FF9678] hover:underline">Get in touch</a>.
                </p>
              </div>
            </div>
          </div>

          {/* Accordion items — editorial style with numbering and reveal */}
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className="group"
                >
                  {/* Top rule — thin line with crosshair accent */}
                  <div className="relative h-[1px] bg-black/[0.06]">
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: isOpen ? '#FF9678' : 'rgba(0,0,0,0.12)',
                        boxShadow: isOpen ? '0 0 8px rgba(255,150,120,0.4)' : 'none',
                      }}
                    />
                  </div>

                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full flex items-start gap-4 md:gap-6 py-6 md:py-8 text-left group/btn"
                  >
                    {/* Number — editorial index */}
                    <span
                      className="text-xs font-medium tabular-nums pt-1 transition-colors duration-300 flex-shrink-0 w-6"
                      style={{ color: isOpen ? '#FF9678' : 'rgba(0,0,0,0.2)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Question text */}
                    <span
                      className="flex-1 text-base md:text-lg transition-colors duration-300"
                      style={{
                        fontFamily: "'Instrument Serif', serif",
                        color: isOpen ? '#1A1A18' : 'rgba(26,26,24,0.6)',
                      }}
                    >
                      {faq.question}
                    </span>

                    {/* Toggle icon — morphing line */}
                    <div className="relative w-5 h-5 flex-shrink-0 mt-1">
                      <span
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-[1.5px] rounded-full transition-all duration-500"
                        style={{ backgroundColor: isOpen ? '#FF9678' : 'rgba(0,0,0,0.25)' }}
                      />
                      <span
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-[1.5px] rounded-full transition-all duration-500"
                        style={{
                          backgroundColor: isOpen ? '#FF9678' : 'rgba(0,0,0,0.25)',
                          transform: `translate(-50%, -50%) rotate(${isOpen ? '0deg' : '90deg'})`,
                        }}
                      />
                    </div>
                  </button>

                  {/* Answer — slides down with content reveal */}
                  <div
                    className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      maxHeight: isOpen ? '300px' : '0px',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="pl-10 md:pl-12 pb-8 pr-10">
                      <p className="text-sm text-black/45 leading-[1.8] max-w-lg">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Final bottom rule */}
            <div className="h-[1px] bg-black/[0.06]" />
          </div>
        </section>
        </ScrollFadeUp>

        {/* ===== FINAL CTA ===== */}
        <SectionDivider />
        <ScrollFadeUp>
        <section className="py-8">
          <div className="card p-12 md:p-16 text-center">
            <h2 className="text-4xl md:text-6xl serif mb-4">
              Ready to get started?
            </h2>
            <p className="text-black/50 mb-8 max-w-md mx-auto">
              Join 2,400+ freelancers who&apos;ve taken control of their finances with Pulse.
            </p>

            <div className="flex flex-row items-center justify-center gap-3">
              <SwapCTA href="/onboarding" defaultText="Start free trial" revealText="It's free forever" variant="primary" />
              <SwapCTA href="/dashboard" defaultText="Book a demo" revealText="Takes 2 minutes" variant="secondary" />
            </div>
          </div>
        </section>
        </ScrollFadeUp>

        {/* ===== FOOTER ===== */}
        <SectionDivider />
        <ScrollFadeUp>
        <footer className="pt-12 pb-8 overflow-hidden">
          {/* Giant typographic moment */}
          <div className="group relative select-none mb-12 cursor-pointer">
            <div
              className="text-center serif leading-[0.85] footer-pulse"
              style={{
                fontSize: 'clamp(100px, 20vw, 280px)',
                color: 'transparent',
                letterSpacing: '-0.04em',
              }}
            >
              Pulse
            </div>
            {/* Salmon accent overlay — offset for depth */}
            <div
              className="absolute inset-0 text-center serif leading-[0.85] pointer-events-none footer-pulse-salmon"
              style={{
                fontSize: 'clamp(100px, 20vw, 280px)',
                color: 'transparent',
                letterSpacing: '-0.04em',
                transform: 'translate(3px, 3px)',
              }}
            >
              Pulse
            </div>
          </div>

          {/* Bottom rule + copyright */}
          <div className="h-[1px] bg-black/[0.06] mb-6" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[11px] text-black/25">
              © {new Date().getFullYear()} Pulse. All rights reserved.
            </p>
            <p className="text-[11px] text-black/20">
              Designed for freelancers, by freelancers.
            </p>
          </div>
        </footer>
        </ScrollFadeUp>
        <SectionDivider />
      </main>
    </div>
  );
}
