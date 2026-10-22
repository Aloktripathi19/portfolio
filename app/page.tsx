import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Work from "@/components/Work";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Credentials from "@/components/Credentials";
import Game from "@/components/Game";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const band = ["Next.js", "Python", "PostgreSQL", "pgvector", "RAG", "AWS ECS", "Docker", "Flutter", "TypeScript", "Tailwind"];
const big = ["Full-stack", "Production", "End to end", "Shipped"];

export default function Home() {
  return (
    <>
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <main className="relative overflow-x-clip">
        <Hero />
        <div className="py-6">
          <Marquee items={band} tilt={-1.5} />
        </div>
        <About />
        <Experience />
        <div className="overflow-hidden pb-24">
          <Marquee items={big} variant="outline" duration={50} />
        </div>
        <Work />
        <Projects />
        <Skills />
        <Credentials />
        <Game />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
