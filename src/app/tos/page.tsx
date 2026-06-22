import type { Metadata } from "next";
import BackToHome from "@/components/BackToHome";

export const metadata: Metadata = {
  title: "Terms of Service — QRWing",
};

export default function TosPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-gray-700 dark:text-gray-300">
      <BackToHome />
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-2">Last updated: June 22, 2026</p>
      <p className="text-sm text-gray-500 mb-8">
        Please read these terms carefully before using the service. By using QRWing, you agree to be bound by these terms. If you do not agree, do not use the service.
      </p>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">1. Service description</h2>
          <p>QRWing provides a web-based tool to generate, customize, and manage QR codes. Features include QR code generation, image upload, scan tracking, and a user dashboard. Some features require an account.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">2. Eligibility</h2>
          <p>You must be at least 16 years old to create an account. By creating an account, you represent that you meet this requirement. If you are under 16, you may use the service only with the involvement of a parent or guardian.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">3. Account</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>You are responsible for safeguarding your login credentials.</li>
            <li>You must not share your account with others.</li>
            <li>You must provide accurate information when creating your account.</li>
            <li>You must notify us immediately of any unauthorized use of your account.</li>
            <li>We reserve the right to suspend or terminate accounts at our discretion, particularly for violation of these terms.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">4. Acceptable use</h2>
          <p>You agree not to use QRWing for:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Any illegal activity or content</li>
            <li>Generating QR codes that link to malware, phishing, or harmful content</li>
            <li>Uploading images you do not own or have the right to use</li>
            <li>Attempting to disrupt, damage, or gain unauthorized access to our systems</li>
            <li>Violating any applicable laws or regulations</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">5. QR codes and content</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Generated QR codes are provided &quot;as is&quot; without warranty of any kind.</li>
            <li>You are solely responsible for the content your QR codes link to or display.</li>
            <li>We do not monitor or review the content linked by QR codes created by users.</li>
            <li>We reserve the right to remove any QR code or uploaded content that violates these terms.</li>
            <li>Images you upload must be your own work or properly licensed. By uploading, you grant us a limited license to store and serve the image solely for the purpose of providing the service.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">6. Intellectual property</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>QR Code is a registered trademark of Denso Wave Incorporated. QRWing is not affiliated with or endorsed by Denso Wave.</li>
            <li>The QRWing name, logo, website design, and software are our intellectual property and may not be copied or reproduced without permission.</li>
            <li>You retain all rights to the content you create with the service.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">7. Limitation of liability</h2>
          <p>QRWing is provided &quot;as is&quot; and &quot;as available&quot; without any warranty, express or implied. We do not guarantee that the service will be uninterrupted, timely, secure, or error-free.</p>
          <p className="mt-2">To the maximum extent permitted by applicable law, QRWing shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.</p>
          <p className="mt-2">This limitation does not apply to liability that cannot be excluded by law (e.g., fraud, death, or personal injury caused by negligence).</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">8. Termination</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>You may delete your account at any time by contacting us.</li>
            <li>We may suspend or terminate your account at any time, with or without cause, with notice.</li>
            <li>Upon termination, your data will be deleted or anonymized within 30 days, except where retention is required by law.</li>
            <li>Sections on Limitation of Liability and Governing Law survive termination.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">9. Changes to these terms</h2>
          <p>We may update these terms at any time. Material changes will be communicated via email (if you have an account) or a notice on the website. Continued use after changes take effect constitutes acceptance of the new terms. If you do not agree with the changes, you must stop using the service and delete your account.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">10. Governing law and dispute resolution</h2>
          <p>These terms are governed by the laws of the Republic of Angola, without regard to conflict-of-law provisions.</p>
          <p className="mt-2">We encourage you to contact us first to resolve any dispute informally. If a dispute cannot be resolved, it shall be submitted to the competent courts of Luanda, Angola.</p>
          <p className="mt-2">For users in the European Union, nothing in these terms deprives you of the protection of mandatory consumer protection laws in your country of residence, and you may also pursue alternative dispute resolution through the European Commission&apos;s Online Dispute Resolution platform.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">11. Contact</h2>
          <p>For questions about these terms:</p>
          <p className="mt-2">
            Email: <a href="mailto:qrwing.app@gmail.com" className="text-purple-600 hover:underline">qrwing.app@gmail.com</a>
          </p>
        </div>
      </section>
    </main>
  );
}
