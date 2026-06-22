import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imprint — QRWing",
};

export default function ImprintPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-gray-700 dark:text-gray-300">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Imprint / Aviso Legal</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 22, 2026</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Service Provider</h2>
          <p>QRWing is operated by:</p>
          <ul className="list-none mt-2 space-y-1">
            <li><strong>Name:</strong> QRWing</li>
            <li><strong>Contact:</strong> <a href="mailto:qrwing.app@gmail.com" className="text-purple-600 hover:underline">qrwing.app@gmail.com</a></li>
            <li><strong>Jurisdiction:</strong> Republic of Angola</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Contact</h2>
          <p>For legal inquiries, copyright concerns, or general questions:</p>
          <p className="mt-2">
            Email: <a href="mailto:qrwing.app@gmail.com" className="text-purple-600 hover:underline">qrwing.app@gmail.com</a>
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Disclaimer</h2>
          <p>The information provided on this website is for general informational purposes only. While we strive to keep the information accurate, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, or availability of the information.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Trademarks</h2>
          <p>QR Code is a registered trademark of Denso Wave Incorporated. QRWing is not affiliated with, endorsed by, or sponsored by Denso Wave.</p>
        </div>
      </section>
    </main>
  );
}
