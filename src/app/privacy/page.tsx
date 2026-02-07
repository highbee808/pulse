import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Pulse',
};

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-[#F5F2EA]">
      <div className="edge-lines" />

      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link href="/" className="text-2xl serif mb-16 block hover:opacity-70 transition-opacity">Pulse</Link>

        <h1 className="text-5xl serif mb-3">Privacy Policy</h1>
        <p className="text-sm text-[#2A2A28]/40 mb-12">Last updated: February 2026</p>

        <div className="space-y-10 text-[#2A2A28]/70 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl serif text-[#2A2A28] mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly, including your name, email address, and financial data you choose to import. We also collect usage data such as pages visited, features used, and interaction patterns to improve the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl serif text-[#2A2A28] mb-3">2. How We Use Your Information</h2>
            <p>
              Your information is used to provide and improve Pulse&apos;s services, generate revenue insights and forecasts, communicate service updates, and ensure the security of your account. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl serif text-[#2A2A28] mb-3">3. Data Storage &amp; Security</h2>
            <p>
              Your data is encrypted at rest and in transit. We use industry-standard security measures to protect your information. Financial data is stored securely and access is limited to authorized personnel only.
            </p>
          </section>

          <section>
            <h2 className="text-xl serif text-[#2A2A28] mb-3">4. Third-Party Integrations</h2>
            <p>
              When you connect third-party services (such as Stripe, QuickBooks, or banking providers), we access only the data necessary to provide our features. We do not store your third-party credentials directly &mdash; all integrations use secure OAuth tokens.
            </p>
          </section>

          <section>
            <h2 className="text-xl serif text-[#2A2A28] mb-3">5. Cookies &amp; Analytics</h2>
            <p>
              We use essential cookies to maintain your session and preferences. Analytics cookies help us understand how the service is used. You can disable non-essential cookies in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl serif text-[#2A2A28] mb-3">6. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal data at any time. You may export your data or request a complete account deletion. We will respond to all data requests within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl serif text-[#2A2A28] mb-3">7. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. Upon account deletion, we remove your personal and financial data within 30 days. Anonymized, aggregated data may be retained for service improvement.
            </p>
          </section>

          <section>
            <h2 className="text-xl serif text-[#2A2A28] mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy periodically. We will notify you of significant changes via email or an in-app notice. Continued use of the service constitutes acceptance of the updated policy.
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
