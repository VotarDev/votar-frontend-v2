import Hero from "@/src/components/HomePage/Hero";
import Logos from "@/src/components/HomePage/Logos";
import Review from "@/src/components/HomePage/Review";
import Election from "@/src/components/HomePage/Election";
import Partcipate from "@/src/components/HomePage/Partcipate";
import NextLevel from "@/src/components/HomePage/NextLevel";
import Footer from "@/src/components/Footer";
import Head from "next/head";
import Chat from "@/src/components/Chat";
import Nav from "@/src/components/Nav";

export default function Home() {
  return (
    <main>
      <Head>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              url: "https://www.votar.ng",
              name: "Votar",
              description: "Your Choice is Visible, Your Voice is Heard",
              logo: "https://res.cloudinary.com/kingkunmi/image/upload/v1726467753/votar-logo_gt1xxb.svg",
            }),
          }}
        />
      </Head>

      <Nav />
      <Hero />
      <Logos />
      <Review />
      <Election />
      <Partcipate />
      <NextLevel />
      <Footer />
      <Chat />
    </main>
  );
}
