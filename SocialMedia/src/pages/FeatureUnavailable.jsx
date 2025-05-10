import React from 'react';
import { Info } from 'lucide-react';

function FeatureUnavailable() {
  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-body-0 shadow-lg rounded-2xl text-center">
      <Info size={48} className="mx-auto mb-4 text-inputbox-active" aria-hidden="true" />
      <h2 className="text-2xl font-semibold text-text-color-400 mb-2">
        Feature Coming Soon
      </h2>
      <p className="text-body-600">
        We’re currently working on this feature. Please contact the development team for further assistance.
      </p>
    </div>
  );
}

export default FeatureUnavailable;