
const ScrollIndicator = () => (
  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
    <div className="w-6 h-10 rounded-full border-2 border-black/30 flex items-start justify-center">
      <div className="w-1.5 h-3 bg-black/30 rounded-full mt-2 animate-pulse"></div>
    </div>
  </div>
);

export default ScrollIndicator;
