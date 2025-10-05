import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Shield } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE as string | undefined;

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
  imageUrl: z.string().optional(),
  adminPasscode: z.string().min(1, "Enter the owner passcode"),
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
  imageUrl: "",
  adminPasscode: "",
};

type PropertyFormValues = z.infer<typeof propertySchema>;

const Admin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues,
  });

  const createListing = useMutation({
    mutationFn: async (values: PropertyFormValues) => {
      if (!ADMIN_PASSCODE) {
        throw new Error(
          "VITE_ADMIN_PASSCODE is not configured. Set it in your environment before using the owner form.",
        );
      }

      if (values.adminPasscode !== ADMIN_PASSCODE) {
        throw new Error("Incorrect owner passcode. Please try again.");
      }

      const { adminPasscode: _adminPasscode, propertyType, imageUrl, ...rest } = values;

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
        image_url: imageUrl?.trim() || null,
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
      const lastStatus = form.getValues("status");
      form.reset({ ...defaultValues, status: lastStatus });
    },
    onError: (error: Error) => {
      toast({
        title: "Unable to create listing",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: PropertyFormValues) => {
    createListing.mutate(values);
  };

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
          <Button variant="outline" asChild>
            <Link to="/">Back to site</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Before you begin</AlertTitle>
            <AlertDescription>
              <p>
                Ensure the Supabase Row Level Security policy allows the owner&apos;s authenticated user (or service role) to
                insert rows into the <span className="font-mono text-sm">properties</span> table. Without that policy,
                Supabase will block form submissions.
              </p>
              <p className="mt-2">
                Protect this page by setting a strong <span className="font-mono text-sm">VITE_ADMIN_PASSCODE</span> value in
                your deployment environment. Only someone with the passcode can publish new listings.
              </p>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader className="space-y-2">
              <CardTitle>Add a property</CardTitle>
              <CardDescription>Fill in the details below to publish a new listing.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Image filename or URL</FormLabel>
                          <FormControl>
                            <Input placeholder="property-1.jpg or https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
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

                  <FormField
                    control={form.control}
                    name="adminPasscode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner passcode</FormLabel>
                        <FormControl>
                          <Input type="password" autoComplete="current-password" placeholder="Enter the secure passcode" {...field} />
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
        </div>
      </main>
    </div>
  );
};

export default Admin;
