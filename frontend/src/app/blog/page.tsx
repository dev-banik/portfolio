import { Suspense } from "react";
import BlogClient from "./BlogClient";

export const metadata = {
  title: "Blog | Parthib Banik",
  description: "Articles and thoughts on .NET, backend development, system design, and software engineering.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 section-padding">
      <Suspense fallback={<div className="animate-pulse" />}>
        <BlogClient />
      </Suspense>
    </main>
  );
}
