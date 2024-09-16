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
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"
        />

        <title>Votar - Home</title>
        <meta name="title" content="Votar"></meta>
        <meta property="og:title" content="Votar" />
        <meta
          name="description"
          content="Votar – The platform where your choice is visible, and your voice is heard. Participate in elections and shape your future."
        />
        <meta
          property="og:description"
          content="Join Votar today and make sure your voice counts in every election. Participate, engage, and take democracy to the next level."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/kingkunmi/image/upload/v1726422889/Screenshot_2024-09-15_at_18.04.46_igftax_c_fill_w_1200_h_630_p1sqdh.png"
        ></meta>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000"></meta>
        <meta property="og:url" content="https://www.votar.ng/" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://metatags.io/" />
        <meta property="twitter:title" content="Votar" />
        <meta
          property="twitter:description"
          content="Votar – The platform where your choice is visible, and your voice is heard. Participate in elections and shape your future."
        />
        <meta
          property="twitter:image"
          content="https://res.cloudinary.com/kingkunmi/image/upload/v1726422889/Screenshot_2024-09-15_at_18.04.46_igftax_c_fill_w_1200_h_630_p1sqdh.png"
        />

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
