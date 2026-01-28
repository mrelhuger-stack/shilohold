import pastorImage from "@/assets/pastor-and-first-lady.png";

const WelcomeSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl" />
              <img
                src={pastorImage}
                alt="Pastor George Patterson and First Lady Patterson"
                className="relative rounded-xl shadow-xl w-full max-w-md mx-auto object-cover aspect-[3/4]"
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <div>
              <p className="text-primary font-medium mb-2">Welcome Home</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                A Message from Our Pastor
              </h2>
              <div className="section-divider !mx-0 mb-6" />
            </div>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Welcome to Shiloh Old Site Baptist Church! Whether you're seeking a church home 
                or just visiting, we're honored that you've chosen to learn more about our family 
                of faith. At Shiloh, we believe in the power of God's Word to transform lives and 
                build a community of believers who support and encourage one another.
              </p>
              <p>
                Our doors are open to everyone—no matter where you are in your spiritual journey. 
                We invite you to join us for worship, fellowship, and growth. Come as you are, 
                and experience the love of Christ through our church family.
              </p>
              <p>
                We look forward to meeting you and welcoming you into our community. May God 
                bless you richly!
              </p>
            </div>

            <div className="pt-4">
              <p className="font-display text-lg font-semibold text-foreground">
                Pastor George Patterson
              </p>
              <p className="text-muted-foreground">
                & First Lady Patterson
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
