import { NCRFHeroSection } from "@/components/NCRFHeroSection";
import { ProgramsSection } from "@/components/ProgramsSection";
import { ImpactStatsSection } from "@/components/ImpactStatsSection";
import { ServicesSection } from "@/components/ServicesSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <NCRFHeroSection />
      <ProgramsSection />
      <ImpactStatsSection />
      <ServicesSection />
    </div>
  );
};

export default Index;
