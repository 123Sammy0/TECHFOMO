import React from 'react';
import HomeClient from './HomeClient';
import { getTopNews } from '@/lib/api';

export default async function Page() {
  const articles = await getTopNews();

  return <HomeClient articles={articles} />;
}
