import { notFound } from 'next/navigation';
import { menuData } from '../../../lib/menuData';
import StallClient from './StallClient';

interface PageProps {
  params: Promise<{ stall: string }>;
  searchParams?: Promise<{ cafeteria?: string }>;
}

// Generates all static paths for the dynamic [stall] route
export async function generateStaticParams(): Promise<{ stall: string }[]> {
  return Object.keys(menuData).map((stall) => ({ stall }));
}

export default async function StallPage({ params, searchParams }: PageProps) {
  const { stall } = await params;
  const { cafeteria } = searchParams ? await searchParams : { cafeteria: undefined };
  const items = menuData[stall];

  if (!items) return notFound();

  return <StallClient stall={stall} items={items} />;
}
