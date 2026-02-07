import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#F5F2EA] flex items-center justify-center">
      <div className="edge-lines" />

      <div className="text-center px-6">
        <p className="text-[120px] leading-none serif text-[#FF9678]/20 mb-2 select-none">404</p>
        <h1 className="text-3xl serif mb-3">Page not found</h1>
        <p className="text-[#2A2A28]/50 mb-10 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#2A2A28] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#3a3a38] transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
