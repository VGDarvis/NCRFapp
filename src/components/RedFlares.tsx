const RedFlares = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Top-right: large red */}
      <div className="flare flare-red flare-lg flare-animate" style={{ top: '-10%', right: '-5%' }} />
      {/* Bottom-left: medium red */}
      <div className="flare flare-red flare-md flare-animate" style={{ bottom: '5%', left: '-8%', animationDelay: '2s' }} />
      {/* Center-right: small gold */}
      <div className="flare flare-gold flare-sm flare-animate" style={{ top: '45%', right: '5%', animationDelay: '4s' }} />
      {/* Top-left: medium red, offset */}
      <div className="flare flare-red flare-md flare-animate" style={{ top: '15%', left: '10%', animationDelay: '6s' }} />
    </div>
  );
};

export default RedFlares;
