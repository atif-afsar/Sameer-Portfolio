import ParallaxSection from './ParallaxSection';

const ParallaxLayout = ({ sections = [], normalSections = [] }) => {
  return (
    <div className="w-full">
      {/* Container for parallax sections with sticky positioning */}
      <div className="relative">
        {sections.slice(0, 3).map((section, index) => (
          <div key={`parallax-wrapper-${index}`} className="h-screen">
            <ParallaxSection 
              index={index + 1}
              className={section.className}
              background={section.background}
              midground={section.midground}
              foreground={section.foreground}
            />
          </div>
        ))}
      </div>
      
      {/* Remaining sections with normal scroll */}
      <div className="relative z-50 bg-white">
        {normalSections.map((section, index) => (
          <div key={`normal-${index}`} className="w-full">
            {section}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParallaxLayout;
