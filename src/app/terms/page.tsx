import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Pulse',
};

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-[#F5F2EA]">
      <div className="edge-lines" />

      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link href="/" className="text-2xl serif mb-16 block hover:opacity-70 transition-opacity">Pulse</Link>

        <h1 className="text-5xl serif mb-3">Terms of Service</h1>
        <p className="text-sm text-[#2A2A28]/40 mb-12">Last updated: February 2026</p>

        <div className="space-y-10 text-[#2A2A28]/70 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl serif text-[#2A2A28] mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Pulse, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl serif text-[#2A2A28] mb-3">2. Description of Service</h2>
            <p>
              Pulse provides revenue intelligence tools for freelancers and independent professionals, including income tracking, forecasting, and financial analytics. The service is provided &ldquo;as is&rdquo; and may be updated or modified at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl serif text-[#2A2A28] mb-3">3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information during registration and keep your account information up to date.
            </p>
          </section>

          <section>
            <h2 className="text-xl serif text-[#2A2A28] mb-3">4. Acceptable Use</h2>
            <p>
              You agree not to misuse the service, interfere with its operation, or attempt to access it through unauthorized means. You may not use Pulse for any unlawful purpose or in violation of any applicable regulations.
            </p>
          </section>

          <section>
            <h2 className="text-xl serif text-[#2A2A28] mb-3">5. Intellectual Property</h2>
            <p>
              All content, features, and functionality of Pulse are owned by Pulse and are protected by copyright, trademark, and other intellectual property laws. Your data remains yours &mdash; we claim no ownership over the financial information you provide.
            </p>
          </section>

          <section>
            <h2 className="text-xl serif text-[#2A2A28] mb-3">6. Limitation of Liability</h2>
            <p>
              Pulse is a financial tracking tool and does not provide financial advice. We are not liable for any decisions made based on information provided by the service. In no event shall Pulse be liable for any indirect, incidental, or consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl serif text-[#2A2A28] mb-3">7. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the service at our discretion. You may delete your account at any time. Upon termination, your right to use the service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl serif text-[#2A2A28] mb-3">8. Changes to Terms</h2>
            <p>
              We may revise these terms at any time by updating this page. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-black/[0.06]">
          <Link href="/" className="text-sm text-[#E8927C] hover:underline">&larr; Back to home</Link>
        </div>
      </div>
    </div>
  );
}
