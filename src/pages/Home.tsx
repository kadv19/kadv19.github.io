import { Hero } from "../sections/Hero";
import { About } from "../sections/About";
import { Work } from "../sections/Work";
import { TechnicalIdentity } from "../sections/TechnicalIdentity";
import { Journey } from "../sections/Journey";
import { CurrentExploration } from "../sections/CurrentExploration";
import { Quantum } from "../sections/Quantum";
import { Contact } from "../sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Work />
      <TechnicalIdentity />
      <Journey />
      <CurrentExploration />
      <Quantum />
      <Contact />
    </>
  );
}
