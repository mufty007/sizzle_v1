import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "RecipeVerse transformed my cooking journey. The recipes are easy to follow and always delicious!",
    author: "Sarah Johnson",
    role: "Home Chef"
  },
  {
    quote: "As a professional chef, I love sharing my recipes here. The community is incredibly supportive.",
    author: "Michael Chen",
    role: "Professional Chef"
  },
  {
    quote: "Found amazing recipes that my whole family enjoys. The step-by-step instructions are perfect.",
    author: "Emily Rodriguez",
    role: "Food Enthusiast"
  }
];

export function Testimonials() {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">What Our Community Says</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative bg-background p-8 rounded-lg shadow-md">
              <Quote className="absolute -top-4 -left-4 h-8 w-8 text-primary/20" />
              <blockquote className="relative">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {testimonial.quote}
                </p>
                <footer>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}