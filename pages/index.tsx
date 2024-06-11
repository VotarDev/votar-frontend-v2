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

        <title>Votar</title>
        <meta
          name="description"
          content="Your Choice is Visible, Your Voice is Heard"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000"></meta>
        <meta property="og:title" content="Votar" />
        <meta property="og:url" content="https://www.votar.ng/" />
        <meta
          property="og:description"
          content="Your Choice is Visible, Your Voice is Heard"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
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
