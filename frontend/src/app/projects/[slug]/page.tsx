import { Suspense } from "react";
import ProjectDetailClient from "./ProjectDetailClient";

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen pt-24 pb-16 section-padding">
      <Suspense fallback={<div className="animate-pulse" />}>
        <ProjectDetailClient slug={params.slug} />
      </Suspense>
    </main>
  );
}
