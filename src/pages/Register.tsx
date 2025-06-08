
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PhotoUploadDialog from "@/components/PhotoUploadDialog";
import { AuthContext } from "@/App";

// Register form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirm: z.string()
}).refine((data) => data.password === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const { getRegisteredUsers } = useContext(AuthContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirm: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      // Check if username already exists
      const registeredUsers = getRegisteredUsers();
      const usernameExists = registeredUsers.some((user: any) => 
        user.username.toLowerCase() === values.username.toLowerCase()
      );
      
      if (usernameExists) {
        form.setError('username', { 
          type: 'manual', 
          message: 'This username is already taken' 
        });
        setIsLoading(false);
        return;
      }
      
      // Check if email already exists
      const emailExists = registeredUsers.some((user: any) => 
        user.email.toLowerCase() === values.email.toLowerCase()
      );
      
      if (emailExists) {
        form.setError('email', { 
          type: 'manual', 
          message: 'This email is already registered' 
        });
        setIsLoading(false);
        return;
      }
      
      // Store user data temporarily and show photo upload dialog
      setUserData({
        id: Date.now().toString(),
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password // In a real app, this would be hashed
      });
      
      // Open photo dialog
      setShowPhotoDialog(true);
      
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const completeRegistration = (photoUrl: string | null) => {
    // Complete the registration process with or without a photo
    setIsLoading(true);
    
    // In a real app, you would register with a backend service
    console.log("Registering with:", userData);
    
    // Add the photo to the user data
    const finalUserData = {
      ...userData,
      avatar: photoUrl || '',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
    
    // Store in localStorage (simulating database)
    const registeredUsers = getRegisteredUsers();
    registeredUsers.push(finalUserData);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    // Success - show toast and redirect
    toast({
      title: "Registration successful!",
      description: "Your account has been created.",
    });
    
    setIsLoading(false);
    
    // Redirect to login
    navigate("/login");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Join the ShareHaven community today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input 
                            placeholder="John Doe" 
                            className="pl-10" 
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground">@</span>
                          <Input 
                            placeholder="johndoe" 
                            className="pl-10" 
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input 
                            placeholder="you@example.com" 
                            className="pl-10" 
                            type="email"
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
                
                <FormField
                  control={form.control}
                  name="confirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
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
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Photo Upload Dialog */}
      {userData && (
        <PhotoUploadDialog
          open={showPhotoDialog}
          onClose={() => {
            setShowPhotoDialog(false);
            setIsLoading(false);
          }}
          onComplete={completeRegistration}
          username={userData.username}
        />
      )}
    </>
  );
};

export default Register;
