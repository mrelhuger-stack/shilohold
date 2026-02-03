import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Globe, Users, Mail } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { QRCodeSVG } from "qrcode.react";

const givingMethods = [
  {
    icon: MessageSquare,
    title: "Text to Give",
    description: "Give conveniently from your phone by sending a text message.",
    details: 'Text "Garrisonville offering" to 73256',
    highlight: true,
  },
  {
    icon: Globe,
    title: "Online Giving",
    description: "Give securely online through our giving portal. Scan the QR code or click the link below.",
    link: "https://onrealm.org/Garrisonville/-/form/give/Garrisonvilletext",
    showQR: true,
  },
  {
    icon: Users,
    title: "In Person",
    description: "Give during our worship services. Offering plates are passed during the service, or you can use the giving boxes at the entrance.",
    details: "Sunday Worship: 10:00 AM",
  },
  {
    icon: Mail,
    title: "Mail In",
    description: "Send your offering by mail to our church address.",
    details: "1855 Garrisonville Road, Stafford, VA 22556",
    highlight: true,
  },
];

const GivingPage = () => {
  const heroAnimation = useScrollAnimation();
  const methodsAnimation = useScrollAnimation();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-10 md:py-14 bg-secondary overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-secondary-foreground mb-4 opacity-0 animate-fade-in-down">
            Give
          </h1>
          <p className="text-secondary-foreground/80 text-lg max-w-2xl mx-auto opacity-0 animate-fade-in-up animation-delay-200">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." — 2 Corinthians 9:7
          </p>
        </div>
      </section>

      {/* Why We Give Section */}
      <section 
        ref={heroAnimation.ref as React.RefObject<HTMLElement>}
        className="py-16 md:py-24 bg-background overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className={`max-w-3xl mx-auto text-center ${heroAnimation.isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"}`}>
            <p className="text-primary font-medium mb-2">Stewardship</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why We Give
            </h2>
            <div className="section-divider mb-6" />
            <p className="text-muted-foreground leading-relaxed">
              Giving is an act of worship and obedience to God. Through your generous contributions, 
              we are able to support our church ministries, serve our community, and spread the Gospel. 
              Thank you for partnering with us in this important work.
            </p>
          </div>
        </div>
      </section>

      {/* Ways to Give */}
      <section 
        ref={methodsAnimation.ref as React.RefObject<HTMLElement>}
        className="py-16 md:py-24 bg-muted overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 ${methodsAnimation.isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"}`}>
            <p className="text-primary font-medium mb-2">Your Generosity</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ways to Give
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {givingMethods.map((method, index) => (
              <Card 
                key={index}
                className={`card-hover hover-lift bg-card border-border overflow-hidden ${
                  methodsAnimation.isVisible 
                    ? `opacity-100 animate-fade-in-up animation-delay-${(index + 1) * 100}` 
                    : "opacity-0"
                }`}
              >
                <CardContent className="p-6 text-center flex flex-col h-full">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 icon-bounce transition-colors duration-300 hover:bg-primary/20">
                    <method.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {method.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 flex-grow">
                    {method.description}
                  </p>
                  
                  {method.highlight && method.details && (
                    <div className="bg-primary/10 rounded-lg p-4 mt-auto">
                      <p className="text-primary font-semibold text-lg">
                        {method.details}
                      </p>
                    </div>
                  )}
                  
                  {method.showQR && method.link && (
                    <div className="mt-auto space-y-4">
                      <div className="bg-white p-4 rounded-lg inline-block mx-auto">
                        <QRCodeSVG 
                          value={method.link} 
                          size={120}
                          level="M"
                          includeMargin={false}
                        />
                      </div>
                      <a 
                        href={method.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 font-medium text-sm underline underline-offset-4 block"
                      >
                        Give Online →
                      </a>
                    </div>
                  )}
                  
                  {!method.highlight && !method.showQR && method.details && (
                    <p className="text-primary font-medium mt-auto">
                      {method.details}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Thank You Section */}
      <section className="py-16 md:py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Thank You for Your Generosity
            </h2>
            <p className="text-muted-foreground">
              Your faithful giving enables us to continue our mission of serving God and our community. 
              If you have any questions about giving, please don't hesitate to contact us.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GivingPage;
