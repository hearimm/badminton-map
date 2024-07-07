"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { placesSchema } from "@/schema/placesSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/client";

const formSchema = placesSchema.extend({
  additionalInfoArray: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    })
  ),
});

const mainFields = [
  { name: "place_name", label: "Place Name", description: "Name of the place", required: true },
  { name: "place_type", label: "Place Type", description: "Type of the place", required: true },
  { name: "address", label: "Address", description: "Address of the place", readOnly: true },
];

export default function CreateCourtForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [addressSearchInput, setAddressSearchInput] = useState("");
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        place_name: "",
        place_type: "",
        address: "",
        latitude: null,
        longitude: null,
        additionalInfoArray: [],
      },
    });
  
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "additionalInfoArray",
    });
  
    const lookupAddress = async () => {
      setIsLoading(true);
  
      if (!addressSearchInput) {
        toast({ title: "Error", description: "Please enter an address to search" });
        setIsLoading(false);
        return;
      }
  
      try {
        const headers = {
          'X-NCP-APIGW-API-KEY-ID': process.env.NEXT_PUBLIC_NCP_CLIENT_ID || '',
          'X-NCP-APIGW-API-KEY': process.env.NEXT_PUBLIC_NCP_CLIENT_SECRET || '',
        }
        const url = `/api/geocode?query=${encodeURIComponent(addressSearchInput)}`
        const response = await fetch(url, {headers});
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
        const data = await response.json();
        console.log(data)
        if (data.addresses && data.addresses.length > 0) {
          const { x, y, roadAddress } = data.addresses[0];
          form.setValue('address', roadAddress);
          form.setValue('latitude', parseFloat(y));
          form.setValue('longitude', parseFloat(x));
          toast({ title: "Success", description: "Address information retrieved successfully" });
        } else {
          toast({ title: "Error", description: "Could not find location information for the given address" });
        }
      } catch (error) {
        console.error('Error looking up address:', error);
        toast({ title: "Error", description: "An error occurred while looking up the address" });
      } finally {
        setIsLoading(false);
      }
    };

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
          const additionalInfo = Object.fromEntries(
            data.additionalInfoArray.map(({ key, value }) => [key, value])
          );
      
          // 현재 로그인한 사용자의 ID를 가져옵니다.
          // 실제 구현에서는 이 부분을 인증 시스템에 맞게 수정해야 합니다.
          const supabase = await createClient();
          const { data: { user } } = await supabase.auth.getUser();
          const userId = user?.id;
      
          if (!userId) {
            throw new Error("User not authenticated");
          }
      
          const currentTime = new Date().toISOString();
      
          const submitData = {
            ...data,
            additional_info: additionalInfo,
            created_user: userId,
            modified_user: userId,
            created_at: currentTime,
            modified_at: currentTime,
          };
      
          delete submitData.additionalInfoArray;
          
          console.log(submitData);
          const { data: insertedData, error } = await supabase
            .from('places')
            .insert(submitData)
            .select('*')
            .single();
      
          if (error) throw error;
      
          toast({
            title: "Place created successfully",
            description: "The new place has been added to the database.",
          });
        } catch (error) {
          console.error('Error inserting data:', error);
          toast({
            title: "Error",
            description: "Failed to create place. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }

    const onError = (error: any) => {
        console.error('Error inserting data:', error);
        toast({
            title: "Error",
            description: "Failed to create place. Please try again.",
            variant: "destructive",
        });
    }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Place</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
            <Tabs defaultValue="main" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="main">Main Information</TabsTrigger>
                <TabsTrigger value="additional">Additional Information</TabsTrigger>
              </TabsList>
              <TabsContent value="main">
                {mainFields.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name as keyof z.infer<typeof formSchema>}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                          <Input readOnly={field?.readOnly || false} {...formField} />
                        </FormControl>
                        <FormDescription>{field.description}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                
                <div className="space-y-2">
                  <FormLabel>Address Search</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Input 
                      value={addressSearchInput}
                      onChange={(e) => setAddressSearchInput(e.target.value)}
                      placeholder="Enter address to search"
                    />
                    <Button type="button" onClick={lookupAddress} disabled={isLoading}>
                      {isLoading ? 'Searching...' : 'Search'}
                    </Button>
                  </div>
                  <FormDescription>
                    Search for an address to automatically fill the address, latitude, and longitude fields.
                  </FormDescription>
                </div>

                <div className="space-y-2">
                    <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>주소</FormLabel>
                        <FormControl>
                            <Input readOnly={true} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div className="space-y-2">
                    <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>latitude</FormLabel>
                        <FormControl>
                            <Input readOnly={true} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div className="space-y-2">
                    <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>longitude</FormLabel>
                        <FormControl>
                            <Input readOnly={true} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
              </TabsContent>

              <TabsContent value="additional">
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end space-x-2">
                      <FormField
                        control={form.control}
                        name={`additionalInfoArray.${index}.key`}
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormLabel>Key</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`additionalInfoArray.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormLabel>Value</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="destructive" onClick={() => remove(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ key: "", value: "" })}
                  >
                    Add Field
                  </Button>
                </div>
              </TabsContent>
              </Tabs>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Place"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }