import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#" },
    { label: "Recipes", href: "/recipes" },
    { label: "Categories", href: "#" },
    { label: "Premium", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  resources: [
    { label: "Community", href: "#" },
    { label: "Cooking Tips", href: "#" },
    { label: "Newsletter", href: "#" },
    { label: "Help Center", href: "#" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Licensing", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-x-2 mb-4">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              <span className="font-semibold text-xl">Sizzle</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Discover and share delicious recipes with our global community of food enthusiasts.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} RecipeVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}