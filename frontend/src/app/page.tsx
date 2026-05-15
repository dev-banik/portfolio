import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/public/Hero";
import About from "@/components/public/About";
import Skills from "@/components/public/Skills";
import ExperienceSection from "@/components/public/Experience";
import Projects from "@/components/public/Projects";
import Contact from "@/components/public/Contact";
import EducationSection from "@/components/public/Education";
import CertificationsSection from "@/components/public/Certifications";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <ExperienceSection />
        <EducationSection />
        <Projects />
        <CertificationsSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
