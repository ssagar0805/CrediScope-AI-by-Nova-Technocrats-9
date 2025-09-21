import shieldIcon from "@/assets/shield-icon.png";
import brainIcon from "@/assets/brain-icon.png";
import checkIcon from "@/assets/check-icon.png";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: shieldIcon,
      title: "Submit",
      description: "Submit suspicious content for AI-powered analysis"
    },
    {
      icon: brainIcon,
      title: "Analyze", 
      description: "Our AI scans multiple sources and fact-checks the claim"
    },
    {
      icon: checkIcon,
      title: "Act",
      description: "Get verified results and take informed action"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to verify any content and protect yourself from misinformation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <img 
                    src={step.icon} 
                    alt={`${step.title} icon`}
                    className="w-10 h-10 opacity-80"
                  />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-border -translate-y-0.5"></div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;