import React from "react";
import Hero from "../components/hero";
import About from "../components/about";
import Rooms from "../components/room";
import Services from "../components/services";
import Testimonial from "../components/testimonial";

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Rooms />
      <Services />
      <Testimonial />
    </>
  );
}

export default Home;