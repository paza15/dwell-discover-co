import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Shield, LogOut, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Tables } from "@/integrations/supabase/types";

import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ImageUpload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const propertySchema = z.object({
  title: z.string().min(3, "A title is required"),
  price: z.coerce.number().positive("Enter a positive price"),
  location: z.string().min(3, "A location is required"),
  description: z.string().optional(),
  beds: z.coerce.number().int().min(0, "Beds must be 0 or more"),
  baths: z.coerce.number().int().min(0, "Baths must be 0 or more"),
  sqft: z.coerce.number().int().min(0, "Square footage must be 0 or more"),
  status: z.enum(["For Sale", "For Rent", "Sold", "Rented"], {
    required_error: "Select a status",
  }),
  propertyType: z.string().min(2, "Property type is required"),
});

const blogSchema = z.object({
  title: z.string().min(3, "A title is required"),
  excerpt: z.string().min(10, "An excerpt is required"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  author: z.string().min(2, "Author name is required"),
  category: z.string().min(2, "Category is required"),
  image_url: z.string().optional(),
  published: z.boolean().default(true),
});

const defaultValues = {
  title: "",
  price: 450000,
  location: "",
  description: "",
  beds: 3,
  baths: 2,
  sqft: 1500,
  status: "For Sale" as const,
  propertyType: "House",
};

const defaultBlogValues = {
  title: "",
  excerpt: "",
  content: "",
  author: "",
  category: "",
  image_url: "",
  published: true,
};

type PropertyFormValues = z.infer<typeof propertySchema>;
type BlogFormValues = z.infer<typeof blogSchema>;

const Admin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [blogImage, setBlogImage] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access the owner portal.",
          variant: "destructive",
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const propertyForm = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues,
  });

  const blogForm = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: defaultBlogValues,
  });

  const { data: properties = [] } = useQuery<Tables<'properties'>[]>({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: blogPosts = [] } = useQuery<Tables<'blog_posts'>[]>({
    queryKey: ['blog-posts-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const createListing = useMutation({
    mutationFn: async (values: PropertyFormValues) => {
      const { propertyType, ...rest } = values;

      const payload = {
        title: rest.title,
        price: rest.price,
        location: rest.location,
        beds: rest.beds,
        baths: rest.baths,
        sqft: rest.sqft,
        status: rest.status,
        description: rest.description?.trim() || null,
        property_type: propertyType.trim() || 'House',
        image_url: uploadedImages[0] || null,
        image_urls: uploadedImages.length > 0 ? uploadedImages : null,
      };

      const { error } = await supabase.from("properties").insert([payload]);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Listing created",
        description: "The new property has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      propertyForm.reset(defaultValues);
      setUploadedImages([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Unable to create listing",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProperty = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({
        title: "Property deleted",
        description: "The property has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Unable to delete property",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createBlogPost = useMutation({
    mutationFn: async (values: BlogFormValues) => {
      const payload = {
        title: values.title,
        excerpt: values.excerpt,
        content: values.content,
        author: values.author,
        category: values.category,
        image_url: blogImage || null,
        published: values.published,
      };

      const { error } = await supabase.from("blog_posts").insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Blog post created",
        description: "The new blog post has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["blog-posts-admin"] });
      blogForm.reset(defaultBlogValues);
      setBlogImage("");
    },
    onError: (error: Error) => {
      toast({
        title: "Unable to create blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteBlogPost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts-admin"] });
      toast({
        title: "Blog post deleted",
        description: "The blog post has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Unable to delete blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onPropertySubmit = (values: PropertyFormValues) => {
    createListing.mutate(values);
  };

  const onBlogSubmit = (values: BlogFormValues) => {
    createBlogPost.mutate(values);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <p className="text-lg font-semibold text-foreground">Owner tools</p>
              <p className="text-sm text-muted-foreground">Add new property listings in seconds</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Back to site</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Welcome, {user.email}</AlertTitle>
            <AlertDescription>
              <p>
                You are authenticated and can now manage properties and blog posts.
              </p>
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="space-y-6">
              <Card>
            <CardHeader className="space-y-2">
              <CardTitle>Add a property</CardTitle>
              <CardDescription>Fill in the details below to publish a new listing.</CardDescription>
            </CardHeader>
                <CardContent>
                  <Form {...propertyForm}>
                    <form onSubmit={propertyForm.handleSubmit(onPropertySubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={propertyForm.control}
                          name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Modern loft downtown" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                        />
                        <FormField
                          control={propertyForm.control}
                          name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min={0} placeholder="450000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                        />
                        <FormField
                          control={propertyForm.control}
                          name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Austin, TX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                        />
                        <FormField
                          control={propertyForm.control}
                          name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="For Sale">For Sale</SelectItem>
                              <SelectItem value="For Rent">For Rent</SelectItem>
                              <SelectItem value="Sold">Sold</SelectItem>
                              <SelectItem value="Rented">Rented</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                        />
                        <FormField
                          control={propertyForm.control}
                          name="beds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Beds</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} placeholder="3" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                        />
                        <FormField
                          control={propertyForm.control}
                          name="baths"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Baths</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} placeholder="2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                        />
                        <FormField
                          control={propertyForm.control}
                          name="sqft"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Square footage</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} placeholder="1800" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                        />
                        <FormField
                          control={propertyForm.control}
                          name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property type</FormLabel>
                          <FormControl>
                            <Input placeholder="House, Condo, Apartment..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                        />
                        <div className="md:col-span-2">
                          <FormLabel>Property Images</FormLabel>
                          <ImageUpload
                            images={uploadedImages}
                            onImagesChange={setUploadedImages}
                          />
                        </div>
                      </div>

                      <FormField
                        control={propertyForm.control}
                        name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea rows={5} placeholder="Highlight the best features of this listing" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                      />

                      <Button type="submit" className="w-full md:w-auto" disabled={createListing.isPending}>
                        {createListing.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving listing...
                          </>
                        ) : (
                          "Publish listing"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Manage Properties</CardTitle>
                  <CardDescription>View and delete existing properties</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {properties.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No properties yet</p>
                    ) : (
                      properties.map((property) => (
                        <div
                          key={property.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold">{property.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {property.location} • ${property.price.toLocaleString()} • {property.status}
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this property?")) {
                                deleteProperty.mutate(property.id);
                              }
                            }}
                            disabled={deleteProperty.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blog" className="space-y-6">
              <Card>
                <CardHeader className="space-y-2">
                  <CardTitle>Add a blog post</CardTitle>
                  <CardDescription>Create and publish new blog articles</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...blogForm}>
                    <form onSubmit={blogForm.handleSubmit(onBlogSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={blogForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Top 10 Tips for First-Time Home Buyers" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={blogForm.control}
                          name="author"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Author</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={blogForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <Input placeholder="Buying Guide, Market Insights..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="md:col-span-2">
                          <FormLabel>Cover Image</FormLabel>
                          <ImageUpload
                            images={blogImage ? [blogImage] : []}
                            onImagesChange={(images) => setBlogImage(images[0] || "")}
                          />
                        </div>
                      </div>

                      <FormField
                        control={blogForm.control}
                        name="excerpt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Excerpt</FormLabel>
                            <FormControl>
                              <Textarea rows={3} placeholder="A short summary of the article..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={blogForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea rows={10} placeholder="Full article content..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full md:w-auto" disabled={createBlogPost.isPending}>
                        {createBlogPost.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving post...
                          </>
                        ) : (
                          "Publish blog post"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Manage Blog Posts</CardTitle>
                  <CardDescription>View and delete existing blog posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {blogPosts.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No blog posts yet</p>
                    ) : (
                      blogPosts.map((post) => (
                        <div
                          key={post.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold">{post.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              By {post.author} • {post.category} • {post.published ? "Published" : "Draft"}
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this blog post?")) {
                                deleteBlogPost.mutate(post.id);
                              }
                            }}
                            disabled={deleteBlogPost.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
