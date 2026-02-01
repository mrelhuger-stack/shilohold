import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Youtube, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [prayerData, setPrayerData] = useState({
    name: "",
    email: "",
    phone: "",
    request: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrayerSubmitting, setIsPrayerSubmitting] = useState(false);
  
  const contactAnimation = useScrollAnimation();
  const prayerAnimation = useScrollAnimation();
  const mapAnimation = useScrollAnimation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon.",
    });
    
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const handlePrayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPrayerSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Prayer Request Submitted",
      description: "Thank you for sharing. Our prayer team will lift you up in prayer.",
    });
    
    setPrayerData({ name: "", email: "", phone: "", request: "" });
    setIsPrayerSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePrayerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPrayerData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-secondary overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-secondary-foreground mb-4 opacity-0 animate-fade-in-down">
            Contact Us
          </h1>
          <p className="text-secondary-foreground/80 text-lg max-w-2xl mx-auto opacity-0 animate-fade-in-up animation-delay-200">
            Have questions? We'd love to hear from you. Reach out and let's connect!
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section 
        ref={contactAnimation.ref as React.RefObject<HTMLElement>} 
        className="py-16 md:py-24 bg-background overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className={`space-y-8 ${contactAnimation.isVisible ? "opacity-100 animate-slide-in-left" : "opacity-0"}`}>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Get in Touch
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you have questions about our services, want to learn more about our church, 
                  or need prayer, we're here for you. Don't hesitate to reach out!
                </p>
              </div>

              <div className="space-y-6">
                <Card className="border-border hover-lift">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 icon-bounce">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Address</h3>
                      <p className="text-muted-foreground">
                        1855 Garrisonville Road<br />
                        Stafford, VA 22556
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border hover-lift">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 icon-bounce">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                      <p className="text-muted-foreground">540.752.0673</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border hover-lift">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 icon-bounce">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <p className="text-muted-foreground">info@shilohosbc.org</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border hover-lift">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 icon-bounce">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Office Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 3:00 PM<br />
                        Sunday: 8:30 AM - 1:00 PM
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.facebook.com/shiloh.workingtogether.1855"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.youtube.com/@shiloholdsitebaptistchurch3089"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`${contactAnimation.isVisible ? "opacity-100 animate-slide-in-right" : "opacity-0"}`}>
              <Card className="border-border hover-lift">
                <CardContent className="p-6 md:p-8">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Send Us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="border-border transition-all duration-300 focus:scale-[1.02]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border-border transition-all duration-300 focus:scale-[1.02]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="How can we help you?"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="border-border resize-none transition-all duration-300 focus:scale-[1.02]"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Prayer Request Section */}
      <section 
        ref={prayerAnimation.ref as React.RefObject<HTMLElement>} 
        className="py-16 md:py-24 bg-muted overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 ${prayerAnimation.isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"}`}>
            <p className="text-primary font-medium mb-2">We're Here for You</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Submit a Prayer Request
            </h2>
            <div className="section-divider" />
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Share your prayer needs with us. Our prayer team is dedicated to lifting you up in prayer.
            </p>
          </div>

          <div className={`max-w-2xl mx-auto ${prayerAnimation.isVisible ? "opacity-100 animate-scale-in" : "opacity-0"}`}>
            <Card className="border-border hover-lift">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center icon-bounce">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Prayer Request Form
                  </h3>
                </div>
                <form onSubmit={handlePrayerSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prayer-name">Name</Label>
                      <Input
                        id="prayer-name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        value={prayerData.name}
                        onChange={handlePrayerChange}
                        required
                        className="border-border transition-all duration-300 focus:scale-[1.02]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prayer-email">Email</Label>
                      <Input
                        id="prayer-email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={prayerData.email}
                        onChange={handlePrayerChange}
                        required
                        className="border-border transition-all duration-300 focus:scale-[1.02]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prayer-phone">Phone Number</Label>
                    <Input
                      id="prayer-phone"
                      name="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={prayerData.phone}
                      onChange={handlePrayerChange}
                      className="border-border transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prayer-request">Prayer Request</Label>
                    <Textarea
                      id="prayer-request"
                      name="request"
                      placeholder="Share your prayer request here..."
                      rows={5}
                      value={prayerData.request}
                      onChange={handlePrayerChange}
                      required
                      className="border-border resize-none transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg" 
                    disabled={isPrayerSubmitting}
                  >
                    {isPrayerSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        Submit Prayer Request
                        <Heart className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map */}
      <section 
        ref={mapAnimation.ref as React.RefObject<HTMLElement>} 
        className="py-16 md:py-24 bg-background overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 ${mapAnimation.isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"}`}>
            <p className="text-primary font-medium mb-2">Find Us</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Location
            </h2>
            <div className="section-divider" />
          </div>

          <div className={`max-w-4xl mx-auto h-[400px] rounded-xl overflow-hidden shadow-lg border border-border ${
            mapAnimation.isVisible ? "opacity-100 animate-scale-in" : "opacity-0"
          }`}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3115.123!2d-77.4183!3d38.4828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b6e8a5b5b5b5b5%3A0x1234567890!2s1855+Garrisonville+Rd%2C+Stafford%2C+VA+22556!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Church Location"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
