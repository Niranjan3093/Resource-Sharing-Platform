
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Mail, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthContext } from "@/App";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Login form schema
const formSchema = z.object({
  identifier: z.string().min(1, { message: "Please enter your email or username" }),
  password: z.string().min(1, { message: "Please enter your password" }),
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { login, getRegisteredUsers } = useContext(AuthContext);
  const [loginError, setLoginError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setLoginError("");
      
      // Get registered users from localStorage
      const registeredUsers = getRegisteredUsers();
      
      if (registeredUsers.length === 0) {
        setLoginError("No registered users found. Please create an account first.");
        setIsLoading(false);
        return;
      }
      
      // Check if user exists by email or username
      const user = registeredUsers.find((user: any) => 
        (user.email.toLowerCase() === values.identifier.toLowerCase() || 
        user.username.toLowerCase() === values.identifier.toLowerCase()) && 
        user.password === values.password
      );
      
      if (!user) {
        setLoginError("Invalid credentials. Please check your username/email and password.");
        setIsLoading(false);
        return;
      }
      
      // Call the login method from AuthContext with user data
      login({ 
        id: user.id, 
        name: user.name,
        username: user.username
      });
      
      // Store additional user data
      const userData = {
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone || "+977 9841234567",
        location: user.location || "Kathmandu, Nepal",
        bio: user.bio || "Passionate about sustainable living and community sharing. I love hiking in the Himalayas and experimenting with new recipes!",
        avatar: user.avatar || "https://randomuser.me/api/portraits/men/1.jpg",
        joinedDate: user.joinedDate || "March 2022",
        rating: user.rating || 4.8,
        reviewCount: user.reviewCount || 12,
        itemsShared: user.itemsShared || 8,
        itemsBorrowed: user.itemsBorrowed || 5,
        verifications: user.verifications || ["Email", "Phone", "ID"]
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Success - show toast and redirect
      toast({
        title: "Login successful!",
        description: "Welcome back to ShareHaven.",
      });
      
      // Redirect to profile page
      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your ShareHaven account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input 
                          placeholder="you@example.com or username" 
                          className="pl-10" 
                          type="text"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input 
                          placeholder="••••••••" 
                          type="password" 
                          className="pl-10"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary underline-offset-4 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
