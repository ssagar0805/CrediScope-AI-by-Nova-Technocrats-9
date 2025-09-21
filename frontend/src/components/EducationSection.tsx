const EducationSection = () => {
  const educationCards = [
    {
      icon: "🔍",
      title: "Source Verification",
      description: "Learn to identify credible sources and verify information authenticity",
      link: "#"
    },
    {
      icon: "📸",
      title: "Image Analysis", 
      description: "Detect manipulated images and reverse-search visual content",
      link: "#"
    },
    {
      icon: "📊",
      title: "Data Verification",
      description: "Understand statistics, polls, and data manipulation techniques",
      link: "#"
    },
    {
      icon: "💭",
      title: "Emotional Manipulation",
      description: "Recognize psychological tactics used to spread misinformation",
      link: "#"
    }
  ];

  return (
    <section id="education" className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Education Center
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Build your fact-checking skills with our comprehensive learning resources
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {educationCards.map((card) => (
            <div 
              key={card.title}
              className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-all group cursor-pointer"
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              <div className="text-3xl mb-4">{card.icon}</div>
              
              <h3 className="text-lg font-semibold text-card-foreground mb-3">
                {card.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {card.description}
              </p>

              <a 
                href={card.link}
                className="inline-flex items-center text-primary hover:text-primary-hover text-sm font-medium group-hover:translate-x-1 transition-transform"
              >
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;