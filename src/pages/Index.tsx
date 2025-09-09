import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { FeaturedGamesSection } from "@/components/FeaturedGamesSection";
import { RoleSelectionSection } from "@/components/RoleSelectionSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <FeaturedGamesSection />
      <RoleSelectionSection />
    </div>
  );
};

export default Index;
