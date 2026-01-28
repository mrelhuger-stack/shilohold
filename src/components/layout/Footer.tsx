import { Link } from "react-router-dom";
import { Facebook, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Shiloh Old Site Baptist Church" className="h-16 w-16 object-contain" />
            </Link>
            <p className="text-secondary-foreground/80 text-sm leading-relaxed">
              Working Together Building the Body of Christ One Disciple at a Time
            </p>
            <p className="text-secondary-foreground/60 text-xs">
              Est. 1870 • 2 Corinthians 6:1 • 2 Timothy 2:2
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4 text-primary">Quick Links</h3>
            <nav className="space-y-2">
              <Link to="/about" className="block text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/visit" className="block text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                Plan Your Visit
              </Link>
              <Link to="/events" className="block text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                Events
              </Link>
              <Link to="/sermons" className="block text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                Sermons
              </Link>
              <Link to="/contact" className="block text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4 text-primary">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-secondary-foreground/80">
                <MapPin className="h-4 w-4 mt-1 shrink-0 text-primary" />
                <span>1855 Garrisonville Road<br />Stafford, VA 22556</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-secondary-foreground/80">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>(540) 659-4915</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-secondary-foreground/80">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>info@shilohosbc.org</span>
              </div>
            </div>
          </div>

          {/* Service Times */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4 text-primary">Service Times</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-secondary-foreground/80">
                <Clock className="h-4 w-4 mt-1 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Sunday Worship</p>
                  <p>10:00 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-secondary-foreground/80">
                <Clock className="h-4 w-4 mt-1 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Bible Study</p>
                  <p>Wednesday 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-secondary-foreground/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-secondary-foreground/60">
              © {new Date().getFullYear()} Shiloh Old Site Baptist Church. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/shiloh.workingtogether.1855"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-secondary-foreground/60 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@shiloholdsitebaptistchurch3089"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-secondary-foreground/60 hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
