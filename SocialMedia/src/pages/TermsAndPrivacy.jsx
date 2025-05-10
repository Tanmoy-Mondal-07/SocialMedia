import React from 'react';

export default function TermsAndPrivacy() {
  return (
    <div className="max-w-3xl text-left mx-auto px-6 py-12 text-text-color-600">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <p className="mb-4">
        This project is a personal side project created by an individual developer who is still
        learning and exploring web development. By using this application, you agree to the
        following terms:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-8">
        <li><strong>No Warranty:</strong> This application is provided “as is” without any guarantees.</li>
        <li><strong>Use at Your Own Risk:</strong> This is a learning project. Don’t use it for anything sensitive.</li>
        <li><strong>No Liability:</strong> I’m not responsible for any damages or data loss.</li>
        <li><strong>Modifications:</strong> These terms may be updated at any time.</li>
      </ul>

      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        I value your privacy and aim to keep things simple and transparent. Here’s how your data is
        handled:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-8">
        <li><strong>Personal Data:</strong> Your name and profile picture are only used within the app.</li>
        <li><strong>No Tracking or Ads:</strong> This app doesn’t track you or show ads.</li>
        <li><strong>No Guarantees:</strong> This is not a production-level app. Don’t share anything sensitive.</li>
        <li><strong>Data Usage:</strong> Your data stays with you and can be deleted anytime.</li>
      </ul>

      <p className="text-sm italic">Last updated: 11/04/2025</p>
    </div>
  );
}
