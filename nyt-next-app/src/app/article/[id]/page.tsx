import React from 'react';
import ArticleClient from './ArticleClient';

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ArticleClient id={decodeURIComponent(resolvedParams.id)} />;
}
