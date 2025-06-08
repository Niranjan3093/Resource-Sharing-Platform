
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ItemCard from "@/components/ItemCard";
import { ChevronRight, ArrowRight } from "lucide-react";
import { mockPopularItems, mockCategoryItems } from "@/services/mockData";
import { useContext } from "react";
import { AuthContext } from "@/App";

const Landing = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-36 md:pb-24 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto">
          <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-8">
            <div className="md:w-1/2 md:pr-8">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                Share resources, <span className="text-primary">build community</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-6 md:mb-8 max-w-lg">
                Borrow the things you need from your neighbors. Save money, reduce waste, and connect with your local community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-full font-medium px-6">
                  <Link to="/browse">Browse Items</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full font-medium px-6">
                  <Link to="/add">Share Your Items</Link>
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 md:p-10 shadow-xl border border-primary/10 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
                  Join the Sharing Economy
                </h2>
                <p className="text-lg mb-8">
                  The average home has thousands of dollars worth of items that sit unused most of the time. Why not share them?
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-background rounded-lg shadow-sm">
                    <p className="font-bold text-3xl text-primary">300+</p>
                    <p className="text-sm text-muted-foreground">Items Shared</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg shadow-sm">
                    <p className="font-bold text-3xl text-primary">150+</p>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg shadow-sm col-span-2 md:col-span-1">
                    <p className="font-bold text-3xl text-primary">50+</p>
                    <p className="text-sm text-muted-foreground">Categories</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="py-12 px-4 bg-background">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Popular Items</h2>
            <Link to="/browse" className="flex items-center text-primary font-medium hover:underline">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mockPopularItems.slice(0, 4).map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 bg-accent/30">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-8">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockCategoryItems.slice(0, 8).map((category) => (
              <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={`/browse?category=${category.name}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.count} items</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-accent/20 rounded-lg p-6 text-center">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Find what you need</h3>
              <p className="text-muted-foreground">Browse items available in your neighborhood that you can borrow.</p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-accent/20 rounded-lg p-6 text-center">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Request to borrow</h3>
              <p className="text-muted-foreground">Send a request to the owner and agree on pickup details.</p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-accent/20 rounded-lg p-6 text-center">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Return when done</h3>
              <p className="text-muted-foreground">Use the item for your project and return it when you're finished.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to join our community?</h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
            Sign up today to start borrowing and lending items in your neighborhood.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Button asChild size="lg" variant="secondary" className="rounded-full font-medium px-6">
                  <Link to="/add">Share Your Items</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full font-medium px-6 border-white text-white hover:bg-white/10">
                  <Link to="/browse">Browse Items</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" variant="secondary" className="rounded-full font-medium px-6">
                  <Link to="/register">Create Account</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full font-medium px-6 border-white text-white hover:bg-white/10">
                  <Link to="/browse">Browse Items</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;
