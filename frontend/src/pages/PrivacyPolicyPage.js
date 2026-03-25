import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      {/* Header */}
      <header className="bg-[#2D5A27] text-white py-4 px-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link to="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold">Privacy Policy</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#2D5A27] mb-2">Privacy Policy for Copolyz App</h2>
          <p className="text-gray-500 mb-6">Last updated: December 2025</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Information We Collect</h3>
              <p className="mb-2">When you use the Copolyz app (Coochbehar Polyclinic), we collect the following information:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Name (for appointment booking)</li>
                <li>Phone number (for appointment confirmation and communication)</li>
                <li>Email address (optional, for appointment notifications)</li>
                <li>Appointment preferences (date, time, symptoms)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. How We Use Your Information</h3>
              <p className="mb-2">Your information is used solely for:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Scheduling and managing your appointments</li>
                <li>Sending appointment confirmations and reminders</li>
                <li>Contacting you regarding your appointment status</li>
                <li>Improving our services</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Data Storage and Security</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Your data is stored securely on encrypted servers</li>
                <li>We implement industry-standard security measures</li>
                <li>Access to patient data is restricted to authorized clinic staff only</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Data Sharing</h3>
              <p>We do <strong>not</strong> share, sell, or rent your personal information to third parties. Your data is used exclusively for appointment management at Coochbehar Polyclinic.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Data Retention</h3>
              <p>We retain your appointment records for a reasonable period to facilitate follow-up visits and maintain medical history. You may request deletion of your data at any time by contacting us.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">6. Your Rights</h3>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt out of promotional communications</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">7. Changes to This Policy</h3>
              <p>We may update this privacy policy from time to time. Any changes will be reflected on this page with an updated date.</p>
            </section>

            <section className="bg-[#F7F5F0] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">8. Contact Us</h3>
              <p className="mb-2">If you have any questions about this privacy policy or your data, please contact us:</p>
              <div className="space-y-1">
                <p><strong>Coochbehar Polyclinic</strong></p>
                <p>PVNN Rd, Chaltatala, Cooch Behar, West Bengal 736101</p>
                <p>Phone: 03582-469726</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
