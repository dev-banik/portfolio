import { Suspense } from "react";
import BlogDetailClient from "./BlogDetailClient";

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen pt-24 pb-16 section-padding">
      <Suspense fallback={<div className="animate-pulse" />}>
        <BlogDetailClient slug={params.slug} />
      </Suspense>
    </main>
  );
}
