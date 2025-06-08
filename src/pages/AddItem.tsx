
import { useState, useContext, useRef } from "react";
import { Camera, X, Upload, MapPin, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from "@/App";
import { useNotifications } from "@/contexts/NotificationContext";

export default function AddItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("good");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [available, setAvailable] = useState(true);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addNotification } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };
  
  const processImageFile = (file: File) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
      // Clear any previous image error
      setFormErrors(prev => {
        const updated = {...prev};
        delete updated.image;
        return updated;
      });
    };
    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "There was an error processing your image",
        variant: "destructive",
      });
    };
    reader.readAsDataURL(file);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processImageFile(files[0]);
    }
  };
  
  const removeImage = () => {
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!title.trim()) {
      errors.title = "Please enter an item name";
    }
    
    if (!description.trim()) {
      errors.description = "Please enter a description";
    }
    
    if (!category) {
      errors.category = "Please select a category";
    }
    
    if (!useCurrentLocation && !location.trim()) {
      errors.location = "Please enter a location";
    }
    
    if (!imageUrl) {
      errors.image = "Please upload an image";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real app, we would upload the item to a backend
      // For now, let's add it to local storage
      const newItemId = `item-${Date.now()}`;
      const newItem = {
        id: newItemId,
        title,
        description,
        category,
        condition,
        location: useCurrentLocation ? "Current Location" : location,
        imageUrl,
        available,
        timeAgo: "Just now",
        createdAt: new Date().toISOString(),
        coordinates: [85.324, 27.7172], // Example coordinates for Kathmandu
        owner: {
          id: user?.id || "user1",
          name: user?.name || "John Doe",
          username: user?.username || "johndoe",
          email: user?.email || "john@example.com",
          avatar: user?.avatar || "https://randomuser.me/api/portraits/men/1.jpg",
        },
        likesCount: 0,
        isUserAdded: true
      };
      
      // Get existing items
      const existingItems = JSON.parse(localStorage.getItem('items') || '[]');
      
      // Add new item
      localStorage.setItem('items', JSON.stringify([newItem, ...existingItems]));
      
      // Update user stats
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (userData.itemsShared !== undefined) {
        userData.itemsShared += 1;
        localStorage.setItem('userData', JSON.stringify(userData));
      }
      
      // Add a notification for all users
      addNotification({
        type: 'new_item',
        title: 'New Item Available',
        message: `${user?.name || "Someone"} just shared ${title}`,
        relatedItemId: newItemId
      });
      
      // Show success toast
      toast({
        title: "Item added successfully",
        description: "Your item has been added and is now visible to others",
      });
      
      // Reload the page data to reflect changes in different tabs/windows
      window.dispatchEvent(new Event('storage'));
      
      // Redirect to my items page
      navigate("/my-items");
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Failed to add item",
        description: "There was an error adding your item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-3xl pt-24 pb-12 px-4">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Share a New Item</h1>
          <p className="text-muted-foreground">
            Fill in the details about the item you want to share with your community
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Item Image Upload */}
          <Card>
            <CardContent className="pt-6">
              <Label htmlFor="item-image" className="block mb-4">Item Photo</Label>
              
              {imageUrl ? (
                <div className="relative">
                  <img 
                    src={imageUrl} 
                    alt="Item preview" 
                    className="max-h-[300px] w-full object-contain rounded-lg border"
                  />
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    type="button"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                    ${isDragging ? 'border-primary bg-primary/5' : formErrors.image ? 'border-destructive' : 'border-muted-foreground/25 hover:border-primary/50'}`}
                  onClick={openFileDialog}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Camera className={`h-12 w-12 mx-auto mb-4 ${formErrors.image ? 'text-destructive' : 'text-muted-foreground'}`} />
                  <p className={`text-sm mb-2 ${formErrors.image ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {formErrors.image || "Drag and drop an image, or click to browse"}
                  </p>
                  <input
                    id="item-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                  />
                  <Button variant="secondary" className="mt-2" type="button">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Item Details */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className={formErrors.title ? "text-destructive" : ""}>Item Name</Label>
                <Input 
                  id="title" 
                  placeholder="What are you sharing?" 
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (e.target.value) {
                      setFormErrors(prev => {
                        const updated = {...prev};
                        delete updated.title;
                        return updated;
                      });
                    }
                  }}
                  className={formErrors.title ? "border-destructive" : ""}
                />
                {formErrors.title && <p className="text-xs text-destructive">{formErrors.title}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className={formErrors.description ? "text-destructive" : ""}>Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Tell people about your item, its features, and usage instructions..." 
                  className={`min-h-[120px] ${formErrors.description ? "border-destructive" : ""}`}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (e.target.value) {
                      setFormErrors(prev => {
                        const updated = {...prev};
                        delete updated.description;
                        return updated;
                      });
                    }
                  }}
                />
                {formErrors.description && <p className="text-xs text-destructive">{formErrors.description}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category" className={formErrors.category ? "text-destructive" : ""}>Category</Label>
                <Select 
                  onValueChange={(value) => {
                    setCategory(value);
                    setFormErrors(prev => {
                      const updated = {...prev};
                      delete updated.category;
                      return updated;
                    });
                  }}
                  value={category}
                >
                  <SelectTrigger id="category" className={formErrors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tools">Tools & Equipment</SelectItem>
                    <SelectItem value="kitchen">Kitchen Appliances</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="garden">Garden & Outdoor</SelectItem>
                    <SelectItem value="sports">Sports & Leisure</SelectItem>
                    <SelectItem value="party">Party & Events</SelectItem>
                    <SelectItem value="clothes">Clothes & Accessories</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.category && <p className="text-xs text-destructive">{formErrors.category}</p>}
              </div>
              
              <div className="space-y-3">
                <Label>Condition</Label>
                <RadioGroup 
                  defaultValue="good" 
                  value={condition}
                  onValueChange={setCondition}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="like-new" id="like-new" />
                    <Label htmlFor="like-new" className="cursor-pointer">Like New</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="good" />
                    <Label htmlFor="good" className="cursor-pointer">Good</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fair" id="fair" />
                    <Label htmlFor="fair" className="cursor-pointer">Fair</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="worn" id="worn" />
                    <Label htmlFor="worn" className="cursor-pointer">Well-worn</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
          
          {/* Location */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <Label htmlFor="location" className={formErrors.location ? "text-destructive" : ""}>Location</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="use-current" 
                    checked={useCurrentLocation}
                    onCheckedChange={(checked) => {
                      setUseCurrentLocation(checked);
                      if (checked) {
                        setFormErrors(prev => {
                          const updated = {...prev};
                          delete updated.location;
                          return updated;
                        });
                      } else if (!location) {
                        setFormErrors(prev => ({...prev, location: "Please enter a location"}));
                      }
                    }}
                  />
                  <Label htmlFor="use-current" className="cursor-pointer text-sm">
                    Use current location
                  </Label>
                </div>
              </div>
              
              {!useCurrentLocation && (
                <div>
                  <Input 
                    id="location" 
                    placeholder="Where is the item located?" 
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (e.target.value) {
                        setFormErrors(prev => {
                          const updated = {...prev};
                          delete updated.location;
                          return updated;
                        });
                      }
                    }}
                    className={formErrors.location ? "border-destructive" : ""}
                  />
                  {formErrors.location && <p className="text-xs text-destructive mt-1">{formErrors.location}</p>}
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>Your exact address is not shared with others</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Availability */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="available">Availability</Label>
                <Switch 
                  id="available" 
                  checked={available}
                  onCheckedChange={setAvailable}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {available 
                  ? "Your item is available for others to borrow." 
                  : "Your item is currently unavailable for borrowing."}
              </p>
            </CardContent>
          </Card>
          
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/my-items")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Adding Item...
                </div>
              ) : "Share Item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
