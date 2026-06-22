import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — QRWing",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-gray-700 dark:text-gray-300">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-2">Last updated: June 22, 2026</p>
      <p className="text-sm text-gray-500 mb-8">
        This policy applies to the website <strong>qrwing.vercel.app</strong> and its subdomains.
      </p>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">1. Who we are</h2>
          <p>QRWing is a QR code generation service operated from Angola. For any privacy-related inquiries, contact us at <a href="mailto:qrwing.app@gmail.com" className="text-purple-600 hover:underline">qrwing.app@gmail.com</a>.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">2. What data we collect and why</h2>

          <h3 className="font-semibold mt-4 mb-1 text-gray-800 dark:text-gray-200">2.1 Account data</h3>
          <p>When you sign in with Google, GitHub, or Discord we collect:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Your name</li>
            <li>Your email address</li>
            <li>Your profile picture URL</li>
          </ul>
          <p className="mt-1"><strong>Purpose:</strong> account creation, authentication, and personalization.</p>
          <p><strong>Legal basis:</strong> performance of a contract (Article 6(1)(b) GDPR) &mdash; necessary to provide the service.</p>

          <h3 className="font-semibold mt-4 mb-1 text-gray-800 dark:text-gray-200">2.2 QR codes and uploads</h3>
          <p>QR codes you save and images you upload are stored to provide the service.</p>
          <p><strong>Purpose:</strong> storing your creations and allowing you to access them via your dashboard.</p>
          <p><strong>Legal basis:</strong> performance of a contract.</p>

          <h3 className="font-semibold mt-4 mb-1 text-gray-800 dark:text-gray-200">2.3 Scan data</h3>
          <p>When someone scans one of your QR codes, we log: timestamp, IP address, user-agent, and referrer URL.</p>
          <p><strong>Purpose:</strong> providing scan analytics in your dashboard.</p>
          <p><strong>Legal basis:</strong> legitimate interest (Article 6(1)(f) GDPR) &mdash; analytics are a core feature of the service.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">3. Cookies</h2>
          <p>We use only <strong>essential cookies</strong> required for the service to function:</p>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="text-left py-2 pr-4 font-medium">Cookie</th>
                  <th className="text-left py-2 pr-4 font-medium">Purpose</th>
                  <th className="text-left py-2 pr-4 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 pr-4 font-mono text-xs">next-auth.session-token</td>
                  <td className="py-2 pr-4">Session authentication</td>
                  <td className="py-2 pr-4">30 days</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 pr-4 font-mono text-xs">qrwing-lang</td>
                  <td className="py-2 pr-4">Language preference</td>
                  <td className="py-2 pr-4">1 year</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 pr-4 font-mono text-xs">qrwing-theme</td>
                  <td className="py-2 pr-4">Dark/light mode preference</td>
                  <td className="py-2 pr-4">1 year</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 pr-4 font-mono text-xs">qrwing-cookie-consent</td>
                  <td className="py-2 pr-4">Cookie consent record</td>
                  <td className="py-2 pr-4">1 year</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 pr-4 font-mono text-xs">__Secure-next-auth.callback-url</td>
                  <td className="py-2 pr-4">CSRF protection / OAuth flow</td>
                  <td className="py-2 pr-4">Session</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">We do <strong>not</strong> use tracking, analytics, or advertising cookies. You can change your cookie preferences in your browser settings at any time.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">4. Data sharing</h2>
          <p>We do <strong>not</strong> sell, trade, or rent your personal data. We share data only with essential service providers:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Supabase</strong> (EU, Ireland) &mdash; database hosting</li>
            <li><strong>Vercel Inc.</strong> (US) &mdash; hosting and deployment</li>
            <li><strong>Vercel Blob</strong> (US) &mdash; image storage</li>
            <li><strong>Google, GitHub, Discord</strong> &mdash; authentication providers (only the data you authorize)</li>
          </ul>
          <p className="mt-2">Each provider acts as a data processor under our instruction. We have Data Processing Agreements (DPA) in place where required.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">5. International transfers</h2>
          <p>Your data is stored on Supabase servers in Ireland (EU). Some service providers may transfer data to the United States. When transfers occur, we rely on the adequacy decisions or Standard Contractual Clauses (SCCs) adopted by the European Commission to ensure an equivalent level of protection.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">6. Data retention</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Account data:</strong> retained until you request deletion</li>
            <li><strong>QR codes:</strong> retained until you delete them or your account is removed</li>
            <li><strong>Images:</strong> retained until you delete the associated QR code or your account</li>
            <li><strong>Scan logs:</strong> retained for 12 months, then anonymized or deleted</li>
            <li><strong>Session cookies:</strong> retained for 30 days or until logout</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">7. Your rights (GDPR)</h2>
          <p>If you are in the European Economic Area (EEA) or the UK, you have the following rights regarding your personal data:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Access:</strong> request a copy of the data we hold about you</li>
            <li><strong>Rectification:</strong> correct inaccurate or incomplete data</li>
            <li><strong>Erasure:</strong> request deletion of your data (&ldquo;right to be forgotten&rdquo;)</li>
            <li><strong>Restriction:</strong> limit how we process your data</li>
            <li><strong>Portability:</strong> receive your data in a structured, machine-readable format</li>
            <li><strong>Objection:</strong> object to processing based on legitimate interest</li>
          </ul>
          <p className="mt-2">To exercise any of these rights, email <a href="mailto:qrwing.app@gmail.com" className="text-purple-600 hover:underline">qrwing.app@gmail.com</a>. We will respond within 30 days. You also have the right to lodge a complaint with your local data protection authority.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">8. Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your data, including:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Encrypted connections (HTTPS) for all data in transit</li>
            <li>Encrypted database connections</li>
            <li>JWT-based authentication with secure session tokens</li>
            <li>Regular security reviews of our dependencies</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">9. Children&apos;s privacy</h2>
          <p>Our service is not directed to individuals under 16. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, contact us so we can delete it.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">10. Changes to this policy</h2>
          <p>We may update this policy from time to time. Material changes will be communicated via email (if you have an account) or a notice on the website. Continued use after changes takes effect constitutes acceptance of the updated policy.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">11. Contact</h2>
          <p>For any privacy-related inquiries:</p>
          <p className="mt-2">
            Email: <a href="mailto:qrwing.app@gmail.com" className="text-purple-600 hover:underline">qrwing.app@gmail.com</a>
          </p>
        </div>
      </section>
    </main>
  );
}
