import { Suspense } from "react";
import ProjectsClient from "./ProjectsClient";

export const metadata = {
  title: "Projects | Parthib Banik",
  description: "Explore my full-stack projects built with .NET, React, and modern technologies.",
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 section-padding">
      <Suspense fallback={<div className="animate-pulse" />}>
        <ProjectsClient />
      </Suspense>
    </main>
  );
}
