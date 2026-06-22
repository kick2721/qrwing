import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — QRWing",
};

export default function TosPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-gray-700 dark:text-gray-300">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 21, 2026</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">1. Service</h2>
          <p>QRWing is a QR code generator. We provide tools to create, customize, and download QR codes for personal and commercial use.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">2. Account</h2>
          <p>You may use the service without an account. Creating an account is optional and grants access to additional features such as image QR codes and a dashboard.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>You are responsible for maintaining the confidentiality of your account.</li>
            <li>You must not use the service for any illegal or unauthorized purpose.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">3. QR Code Usage</h2>
          <p>Generated QR codes are provided as-is. We do not control the content that QR codes link to and are not responsible for damages resulting from their use.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">4. Image Upload</h2>
          <p>Uploaded images are stored temporarily and linked via QR code. You must own the rights to any images you upload. We may delete uploaded images at any time without notice.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">5. Intellectual Property</h2>
          <p>QR Code is a registered trademark of Denso Wave Incorporated. QRWing is not affiliated with Denso Wave. The QRWing name, logo, and website design are our intellectual property.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">6. Limitation of Liability</h2>
          <p>QRWing is provided &quot;as is&quot; without warranty of any kind. We are not liable for any damages arising from the use or inability to use the service.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">7. Changes</h2>
          <p>We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">8. Contact</h2>
          <p>For questions about these terms: <a href="mailto:kick02721@gmail.com" className="text-purple-600 hover:underline">kick02721@gmail.com</a></p>
        </div>
      </section>
    </main>
  );
}
