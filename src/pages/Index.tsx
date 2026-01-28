import Layout from "@/components/layout/Layout";
import HeroCarousel from "@/components/home/HeroCarousel";
import WelcomeSection from "@/components/home/WelcomeSection";
import ServiceTimes from "@/components/home/ServiceTimes";

const Index = () => {
  return (
    <Layout>
      <HeroCarousel />
      <WelcomeSection />
      <ServiceTimes />
    </Layout>
  );
};

export default Index;
