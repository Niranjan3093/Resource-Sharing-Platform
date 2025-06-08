import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, MapPin, Calendar, Mail, Phone, Shield, ThumbsUp, Image, Upload, LogOut, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ItemCard from "@/components/ItemCard";
import { fetchUserItems } from "@/services/mockData";
import { Item } from "@/types";
import { AuthContext } from "@/App";
import PhotoUploadDialog from "@/components/PhotoUploadDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const nepaleseLocations = [
  "Bhojpur", "Dhankuta", "Ilam", "Jhapa", "Khotang", "Morang", "Okhaldhunga", "Panchthar", 
  "Sankhuwasabha", "Solukhumbu", "Sunsari", "Taplejung", "Tehrathum", "Udayapur", "Bara", 
  "Dhanusa", "Mahottari", "Parsa", "Rautahat", "Saptari", "Sarlahi", "Siraha", "Bhaktapur", 
  "Chitwan", "Dhading", "Dolakha", "Kathmandu", "Kavrepalanchok", "Lalitpur", "Makwanpur", 
  "Nuwakot", "Ramechhap", "Rasuwa", "Sindhuli", "Sindhupalchowk", "Baglung", "Dang", "Gorkha", 
  "Kaski", "Lamjung", "Manang", "Mustang", "Myagdi", "Nawalparasi", "Parbat", "Syangja", 
  "Tanahun", "Arghakhanchi", "Gulmi", "Kapilvastu", "Pyuthan", "Rolpa", "Rupandehi", "Palpa", 
  "Achham", "Bajura", "Darchula", "Dailekh", "Dolpa", "Humla", "Jajarkot", "Jumla", "Kalikot", 
  "Mugu", "Surkhet", "Baitadi", "Dadeldhura", "Doti", "Kailali", "Kanchanpur"
].sort();

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        return JSON.parse(storedUserData);
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
    
    return {
      name: user?.name || "Aarav Sharma",
      username: user?.username || "aaravsharma",
      email: "aarav@example.com",
      phone: "+977 9841234567",
      location: "Kathmandu, Nepal",
      bio: "Passionate about sustainable living and community sharing. I love hiking in the Himalayas and experimenting with new recipes!",
      avatar: localStorage.getItem('userAvatar') || "https://randomuser.me/api/portraits/men/1.jpg",
      joinedDate: "March 2022",
      rating: 4.8,
      reviewCount: 12,
      itemsShared: 8,
      itemsBorrowed: 5,
      verifications: ["Email", "Phone", "ID"]
    };
  });

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    const storedAvatar = localStorage.getItem('userAvatar');
    if (storedAvatar) {
      setUserPhoto(storedAvatar);
    }
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  const handleCreateNewAccount = () => {
    navigate("/register");
  };

  useEffect(() => {
    const loadUserItems = async () => {
      try {
        setLoading(true);
        
        const storedItems = localStorage.getItem('items');
        let userItems: Item[] = [];
        
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          userItems = parsedItems.filter((item: Item) => item.owner?.id === user?.id);
        }
        
        if (userItems.length === 0) {
          userItems = await fetchUserItems(user?.id || 'user1');
        }
        
        setUserItems(userItems);
      } catch (error) {
        console.error("Error loading user items:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your items",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserItems();
  }, [user?.id, toast]);

  const handlePhotoUploadComplete = (photo: string | null) => {
    if (photo) {
      setUserPhoto(photo);
      localStorage.setItem('userAvatar', photo);
      setUserData(prev => ({ ...prev, avatar: photo }));
      
      toast({
        title: "Photo updated",
        description: "Your profile photo has been updated successfully",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingPhoto(true);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setUserPhoto(result);
        localStorage.setItem('userAvatar', result);
        setUserData(prev => ({ ...prev, avatar: result }));
        setUploadingPhoto(false);
        toast({
          title: "Photo updated",
          description: "Your profile photo has been updated successfully",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const name = formData.get('name') as string;
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const location = formData.get('location') as string;
    const bio = formData.get('bio') as string;
    
    setUserData(prev => ({
      ...prev,
      name,
      username,
      email,
      phone,
      location,
      bio,
    }));
    
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleLocationChange = (value: string) => {
    if (!isEditing) {
      setUserData(prev => ({
        ...prev,
        location: value,
      }));
      
      toast({
        title: "Location updated",
        description: "Your location has been updated successfully",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-7xl pt-24 pb-12 px-4">
      <div className="mb-6 flex justify-end space-x-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleCreateNewAccount}
        >
          <UserPlus className="h-4 w-4" />
          Create New Account
        </Button>
        <Button 
          variant="destructive" 
          className="flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={userPhoto || userData.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {userData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {!isEditing ? (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="absolute bottom-4 right-0 h-8 w-8 rounded-full"
                      onClick={() => setShowPhotoUpload(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="absolute bottom-4 right-0">
                      <Input
                        type="file"
                        id="photo-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <Label
                        htmlFor="photo-upload"
                        className="h-8 w-8 flex items-center justify-center bg-white hover:bg-gray-100 rounded-full border cursor-pointer"
                      >
                        {uploadingPhoto ? (
                          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                        ) : (
                          <Image className="h-4 w-4 text-primary" />
                        )}
                      </Label>
                    </div>
                  )}
                </div>
                
                {isEditing ? (
                  <form onSubmit={handleProfileUpdate} className="w-full">
                    <div className="space-y-4 mt-2">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" defaultValue={userData.name} />
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" name="username" defaultValue={userData.username} />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" defaultValue={userData.email} />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" defaultValue={userData.phone} />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Select name="location" defaultValue={userData.location}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your location" />
                          </SelectTrigger>
                          <SelectContent>
                            {nepaleseLocations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" name="bio" defaultValue={userData.bio} className="min-h-[100px]" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mt-2">{userData.name}</h2>
                    <p className="text-sm text-muted-foreground">@{userData.username}</p>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <Select value={userData.location} onValueChange={handleLocationChange}>
                        <SelectTrigger className="h-7 min-h-7 text-sm px-2 border-none bg-transparent hover:bg-accent hover:text-accent-foreground focus:ring-0">
                          <SelectValue placeholder={userData.location} />
                        </SelectTrigger>
                        <SelectContent>
                          {nepaleseLocations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>Member since {userData.joinedDate}</span>
                    </div>
                    
                    <div className="flex items-center mt-3">
                      <div className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                        <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
                        <span>Rating: {userData.rating}/5</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <p className="text-center text-muted-foreground text-sm mb-4">
                      {userData.bio}
                    </p>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mb-4" 
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    
                    <div className="w-full">
                      <h3 className="text-sm font-medium mb-2">Contact Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{userData.email}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{userData.phone}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="w-full">
                      <h3 className="text-sm font-medium mb-2">Verifications</h3>
                      <div className="flex flex-wrap gap-2">
                        {userData.verifications && userData.verifications.map((verification) => (
                          <Badge key={verification} variant="outline" className="flex items-center">
                            <Shield className="h-3 w-3 mr-1 text-primary" />
                            {verification}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="grid grid-cols-2 w-full gap-4">
                      <Card>
                        <CardContent className="p-3 text-center">
                          <p className="text-2xl font-bold">{userData.itemsShared}</p>
                          <p className="text-xs text-muted-foreground">Items Shared</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-3 text-center">
                          <p className="text-2xl font-bold">{userData.itemsBorrowed}</p>
                          <p className="text-xs text-muted-foreground">Items Borrowed</p>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-8">
          <Tabs defaultValue="my-items" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="my-items">My Items</TabsTrigger>
              <TabsTrigger value="borrowed">Borrowed Items</TabsTrigger>
              <TabsTrigger value="history">Activity History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-items">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">My Shared Items</h3>
                  <Button asChild>
                    <a href="/add">+ Add New Item</a>
                  </Button>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin-slow h-12 w-12 rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : userItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {userItems.map((item) => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <Card className="bg-accent/50">
                    <CardContent className="pt-6 flex flex-col items-center text-center p-12">
                      <h3 className="text-lg font-medium mb-2">No Items Yet</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't shared any items yet. Start by adding your first item!
                      </p>
                      <Button asChild>
                        <a href="/add">Add Your First Item</a>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="borrowed">
              <Card className="bg-accent/50">
                <CardContent className="pt-6 flex flex-col items-center text-center p-12">
                  <h3 className="text-lg font-medium mb-2">No Borrowed Items</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't borrowed any items yet. Browse items to find something you need!
                  </p>
                  <Button asChild>
                    <a href="/browse">Browse Items</a>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Activity History</h3>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Power Drill Borrowed</CardTitle>
                      <CardDescription>September 15, 2023</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        You borrowed a Power Drill from Priya Patel for 3 days.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Stand Mixer Shared</CardTitle>
                      <CardDescription>September 10, 2023</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        You added a Stand Mixer to your shared items.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Account Created</CardTitle>
                      <CardDescription>January 15, 2022</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        You created your ShareHaven account and joined the community.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <PhotoUploadDialog
        open={showPhotoUpload}
        onClose={() => setShowPhotoUpload(false)}
        onComplete={handlePhotoUploadComplete}
        username={userData.username || "user"}
      />
    </div>
  );
};

export default Profile;
