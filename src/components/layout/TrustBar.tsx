import React from 'react';

const shoppingDetails = [
  'Compare available phone variants',
  'Contact the store on WhatsApp'
];

export const TrustBar: React.FC = () => (
  <div className="border-y border-zinc-200 bg-white">
    <ul className="mx-auto grid max-w-[1280px] grid-cols-2 gap-x-4 gap-y-2 px-4 py-3 text-xs font-medium text-zinc-700 sm:grid-cols-4 sm:px-6 lg:px-8">
      {shoppingDetails.map(detail => <li key={detail} className="flex min-h-8 items-center">{detail}</li>)}
    </ul>
  </div>
);
