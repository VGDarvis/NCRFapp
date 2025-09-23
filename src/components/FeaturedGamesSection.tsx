import { useState } from "react";
import { ChevronLeft, ChevronRight, Gamepad2 } from "lucide-react";
import nba2k26Cover from "@/assets/nba-2k26-cover.png";

export const FeaturedGamesSection = () => {
  const games = [
    {
      name: "NBA 2K26",
      description: "Official Basketball Simulation",
      color: "from-red-600 to-orange-500",
      image: nba2k26Cover
    },
    {
      name: "Madden 26",
      description: "NFL Football Championship",
      color: "from-green-600 to-emerald-500"
    },
    {
      name: "Super Smash Bros",
      description: "Ultimate Fighting Tournament",
      color: "from-purple-600 to-pink-500"
    },
    {
      name: "Street Fighter 6",
      description: "Classic Fighting Combat",
      color: "from-blue-600 to-cyan-500"
    },
    {
      name: "Tekken 8",
      description: "King of Iron Fist Tournament",
      color: "from-yellow-600 to-amber-500"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % games.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);
  };

  const getVisibleGames = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % games.length;
      visible.push({ ...games[index], index });
    }
    return visible;
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Featured
            <span className="text-primary"> Games</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Compete in the most popular esports titles with official tournaments, 
            rankings, and prize pools for HBCU students.
          </p>
        </div>

        {/* Games Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full glass hover:bg-primary/20 transition-colors duration-300"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full glass hover:bg-primary/20 transition-colors duration-300"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-16">
            {getVisibleGames().map((game, index) => (
              <div
                key={game.index}
                className={`luxury-card p-8 text-center group cursor-pointer transition-all duration-500 ${
                  index === 1 ? 'scale-105 animate-glow-pulse' : 'scale-95 opacity-80'
                }`}
              >
                {/* Game Icon */}
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl overflow-hidden mb-6 group-hover:scale-110 transition-transform duration-300 ${!game.image ? `bg-gradient-to-br ${game.color}` : ''}`}>
                  {game.image ? (
                    <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
                  ) : (
                    <Gamepad2 className="w-12 h-12 text-white" />
                  )}
                </div>
                
                {/* Game Info */}
                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {game.name}
                </h3>
                <p className="text-muted-foreground mb-6">{game.description}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <div className="text-lg font-bold text-primary">Live</div>
                    <div className="text-xs text-muted-foreground uppercase">Tournaments</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">$10K+</div>
                    <div className="text-xs text-muted-foreground uppercase">Prize Pool</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {games.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary scale-125' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="luxury-card p-8 inline-block">
            <p className="text-lg text-muted-foreground mb-4">
              Ready to compete in official HBCU tournaments?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="text-center">
                <div className="text-sm font-semibold text-primary mb-1">Season 1</div>
                <div className="text-xs text-muted-foreground">Registration Open</div>
              </div>
              <div className="hidden sm:block w-px bg-border mx-4"></div>
              <div className="text-center">
                <div className="text-sm font-semibold text-primary mb-1">5 Games</div>
                <div className="text-xs text-muted-foreground">Multiple Formats</div>
              </div>
              <div className="hidden sm:block w-px bg-border mx-4"></div>
              <div className="text-center">
                <div className="text-sm font-semibold text-primary mb-1">Weekly</div>
                <div className="text-xs text-muted-foreground">Tournaments</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};