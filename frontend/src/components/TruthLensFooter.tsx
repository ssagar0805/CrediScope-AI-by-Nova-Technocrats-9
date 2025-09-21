import magnifyingGlassIcon from "@/assets/magnifying-glass.png";

const CrediScopeAIFooter = () => {
  const quickLinks = [
    { name: "Home", href: "#" },
    { name: "Archive", href: "#trends" },
    { name: "Learn", href: "#education" },
    { name: "Authority Dashboard", href: "#authority" }
  ];

  const resources = [
    { name: "Source Verification", href: "#" },
    { name: "Image Analysis", href: "#" },
    { name: "Data Verification", href: "#" },
    { name: "Emotional Manipulation", href: "#" }
  ];

  const factCheckPartners = [
    { name: "FactChecker.in", href: "#" },
    { name: "BOOM Live", href: "#" },
    { name: "Alt News", href: "#" },
    { name: "Vishvas News", href: "#" }
  ];

  const aboutLinks = [
    { name: "About CrediScope AI", href: "#" },
    { name: "Contact Us", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" }
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src={magnifyingGlassIcon} 
                alt="CrediScope AI Logo"
                className="h-8 w-8 invert"
              />
              <span className="text-xl font-bold">CrediScope AI</span>
            </div>
            <p className="text-sm text-background/80 leading-relaxed">
              Empowering India against misinformation through AI-powered fact-checking
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-background">QUICK LINKS</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-background/80 hover:text-background transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-background">RESOURCES</h4>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <a href={resource.href} className="text-sm text-background/80 hover:text-background transition-colors">
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Fact-Check Partners */}
          <div>
            <h4 className="font-semibold mb-4 text-background">FACT-CHECK PARTNERS</h4>
            <ul className="space-y-2">
              {factCheckPartners.map((partner) => (
                <li key={partner.name}>
                  <a href={partner.href} className="text-sm text-primary hover:text-primary-hover transition-colors">
                    {partner.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-4 text-background">ABOUT</h4>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-background/80 hover:text-background transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/60">
              © 2024 CrediScope AI. Built with ❤️ for a more informed India.
            </p>
            <p className="text-sm text-background/60">
              Powered by AI • Verified by Experts • Trusted by Citizens
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CrediScopeAIFooter;