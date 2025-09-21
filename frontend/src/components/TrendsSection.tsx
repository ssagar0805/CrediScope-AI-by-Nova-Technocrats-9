const TrendsSection = () => {
  const trends = [
    {
      category: "Health",
      emoji: "🏥",
      title: "Health Misinformation",
      description: "False medical claims and unverified health advice spreading across social media platforms",
      cases: 247,
      bgColor: "bg-green-500/10",
      textColor: "text-green-600"
    },
    {
      category: "Political",
      emoji: "🗳️", 
      title: "Political Claims",
      description: "Misleading political statements and fabricated news about government policies and leaders",
      cases: 189,
      bgColor: "bg-indigo-500/10", 
      textColor: "text-indigo-600"
    },
    {
      category: "Financial",
      emoji: "💰",
      title: "Financial Scams", 
      description: "Investment frauds, fake schemes, and misleading financial advice targeting Indian investors",
      cases: 156,
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-600"
    }
  ];

  return (
    <section id="trends" className="py-16 lg:py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Recent Misinformation Trends
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed about the latest misinformation patterns affecting India
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {trends.map((trend) => (
            <div 
              key={trend.category}
              className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-all group"
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{trend.emoji}</div>
                <div className={`px-3 py-1 ${trend.bgColor} ${trend.textColor} rounded-full text-sm font-semibold`}>
                  CASES THIS WEEK: {trend.cases}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-card-foreground mb-3">
                {trend.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {trend.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendsSection;