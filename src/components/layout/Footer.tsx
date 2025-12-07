import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
              Atelier
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Curated essentials for the modern home. Thoughtfully designed, sustainably made.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/products" className="hover:text-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?featured=true" className="hover:text-foreground transition-colors">
                  Featured
                </Link>
              </li>
              <li>
                <Link to="/products?category=new" className="hover:text-foreground transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-medium mb-4">Help</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/orders" className="hover:text-foreground transition-colors">
                  Order Status
                </Link>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Shipping & Returns
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Contact Us
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-medium mb-4">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Atelier. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer">Privacy</span>
            <span className="hover:text-foreground cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
