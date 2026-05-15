'use client';

import React from 'react';
import SiteSettingsProvider from '@/contexts/SiteSettingsContext';

export default function SiteSettingsWrapper({ children }: { children: React.ReactNode }) {
  return <SiteSettingsProvider>{children}</SiteSettingsProvider>;
}
