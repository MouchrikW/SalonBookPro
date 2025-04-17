import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border pt-12 pb-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">SalonBook</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">How It Works</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Careers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Press</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">For Customers</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Customer Support</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Booking Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Cancellation Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Gift Cards</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Loyalty Program</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">For Businesses</h3>
            <ul className="space-y-2">
              <li><Link href="/auth?action=become-partner" className="text-muted-foreground hover:text-primary">Join as a Partner</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Business Resources</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Success Stories</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Partner Support</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Partner Terms</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <h3 className="text-lg font-bold mb-2">Download Our App</h3>
            <div className="flex gap-2">
              <a href="#" className="flex items-center justify-center bg-black text-white rounded-lg px-2 py-2 hover:bg-opacity-80 transition-colors">
                <FaApple className="text-xl mr-1" />
                <div>
                  <div className="text-[10px]">Download on the</div>
                  <div className="text-xs font-medium">App Store</div>
                </div>
              </a>
              <a href="#" className="flex items-center justify-center bg-black text-white rounded-lg px-2 py-2 hover:bg-opacity-80 transition-colors">
                <FaGooglePlay className="text-xl mr-1" />
                <div>
                  <div className="text-[10px]">Get it on</div>
                  <div className="text-xs font-medium">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border text-center md:flex md:justify-between md:items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} SalonBook. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-4">
            <Link href="#" className="text-muted-foreground hover:text-primary text-sm">Privacy Policy</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary text-sm">Terms of Service</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary text-sm">Cookie Policy</Link>
            <div className="flex items-center text-sm">
              <span className="mr-2 text-muted-foreground">Language:</span>
              <select className="bg-transparent border-none text-muted-foreground">
                <option>English</option>
                <option>Français</option>
                <option>العربية</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
