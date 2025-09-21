import { Button } from "@/components/ui/button";

const FinalCTASection = () => {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Help Build a More Informed India
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Join thousands of citizens in the fight against misinformation. 
            Every fact-check makes our democracy stronger.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground px-8">
              Start Fact-Checking
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;