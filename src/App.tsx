import OrbitDeliveryHero from "@/components/ui/orbit-delivery-hero";
import { WhatsappFab } from "@/components/ui/whatsapp-fab";
import { BackToTop } from "@/components/ui/back-to-top";
import { Stats } from "@/components/sections/stats";
import { Services } from "@/components/sections/services";
import { Pricing } from "@/components/sections/pricing";
import { Verifica } from "@/components/sections/verifica";
import { Why } from "@/components/sections/why";
import { Process } from "@/components/sections/process";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

export default function App() {
  return (
    <>
      <OrbitDeliveryHero theme="light" />
      <Pricing />
      <Verifica />
      <Stats />
      <Services />
      <Why />
      <Process />
      <About />
      <Contact />
      <Footer />
      <BackToTop />
      <WhatsappFab />
    </>
  );
}
