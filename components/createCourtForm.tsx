"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { supabase } from "@/lib/initSupabase";
import { placesSchema } from "@/schema/placesSchema";


// 필드 정보 정의
const fields = [
    { name: "type", label: "Type", description: "Type of the club." },
    { name: "name", label: "Name", description: "This is the name of the club.", required: true },
    { name: "map_link", label: "Map Link", description: "Link to the map." },
    { name: "address", label: "Address", description: "This is the address of the club." },
    { name: "latitude", label: "Latitude", description: "Latitude of the club location." },
    { name: "longitude", label: "Longitude", description: "Longitude of the club location." },
    { name: "courts", label: "Courts", description: "Number of courts available." },
    { name: "contact", label: "Contact", description: "This is the contact information." },
    { name: "schedule", label: "Schedule", description: "Club schedule." },
    { name: "fee", label: "Fee", description: "The fee for the places." },
    { name: "flooring", label: "Flooring", description: "Type of flooring." },
    { name: "club_id", label: "Club ID", description: "This is the club ID." },
    { name: "club_name", label: "Club Name", description: "This is the club name." },
    { name: "club_review1", label: "Club Review 1", description: "This is the first club review." },
    { name: "club_review2", label: "Club Review 2", description: "This is the second club review." },
    { name: "club_review3", label: "Club Review 3", description: "This is the third club review." },
    { name: "club_website", label: "Club Website", description: "This is the club website." },
    { name: "field1", label: "Field 1", description: "Additional field 1." },
    { name: "field2", label: "Field 2", description: "Additional field 2." },
    { name: "field3", label: "Field 3", description: "Additional field 3." },
    { name: "other_link1", label: "Other Link 1", description: "Additional link 1." },
    { name: "other_link2", label: "Other Link 2", description: "Additional link 2." },
    { name: "other_link3", label: "Other Link 3", description: "Additional link 3." },
    { name: "others", label: "Others", description: "Other information." },
];

// 기본값 객체 타입 정의
type DefaultValues = {
    [key: string]: string | number | null;
};

// 기본값 설정
const defaultValues: DefaultValues = fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
}, {} as DefaultValues);

// Naver 지도 API 타입 선언
declare global {
    interface Window {
      naver: any;
    }
  }
  
  export default function CreateCourtForm() {
      const [isLoading, setIsLoading] = useState(false);
  
      const form = useForm<z.infer<typeof placesSchema>>({
          resolver: zodResolver(placesSchema),
          defaultValues,
      });
  
      const lookupAddress = async () => {
          setIsLoading(true);
          const address = form.getValues('address');
  
          if (!address) {
              toast({
                  title: "Error",
                  description: "Please enter an address",
              });
              setIsLoading(false);
              return;
          }
  
          try {
            console.log('address',address);
            const headers = {
                'X-NCP-APIGW-API-KEY-ID': process.env.NEXT_PUBLIC_NCP_CLIENT_ID || '',
                'X-NCP-APIGW-API-KEY': process.env.NEXT_PUBLIC_NCP_CLIENT_SECRET || '',
            }
            console.log(headers);
              const response = await fetch(`/api/geocode?query=${encodeURIComponent(address)}`
              ,{
                  headers
              });
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              console.log(response);
  
              const data = await response.json();
  
              if (data.addresses && data.addresses.length > 0) {
                  const { x, y } = data.addresses[0];
                  form.setValue('latitude', y);
                  form.setValue('longitude', x);
                  form.setValue('map_link', `https://map.naver.com/v5/search/${encodeURIComponent(address)}`);
  
                  toast({
                      title: "Success",
                      description: "Address information retrieved successfully",
                  });
              } else {
                  toast({
                      title: "Error",
                      description: "Could not find location information for the given address",
                  });
              }
          } catch (error) {
              console.error('Error looking up address:', error);
              toast({
                  title: "Error",
                  description: "An error occurred while looking up the address",
              });
          } finally {
              setIsLoading(false);
          }
      };
  
      async function onSubmit(data: z.infer<typeof placesSchema>) {
          console.log("Form submitted with data:", data);
          const result = await insertData(data);
          if (result.error) {
              toast({
                  title: "Error",
                  description: (
                      <pre className="mt-2 w-[340px] rounded-md bg-red-500 p-4">
                          <code className="text-white">{JSON.stringify(result.error, null, 2)}</code>
                      </pre>
                  ),
              });
          } else {
              toast({
                  title: "Creation successful",
                  description: (
                      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                          <code className="text-white">{JSON.stringify(result.data, null, 2)}</code>
                      </pre>
                  ),
              });
          }
      }

    async function insertData(param: z.infer<typeof placesSchema>) {
        try {
            const { data, error } = await supabase
                .from('places')
                .insert(param)
                .select('*');
            
            console.log('Insert Result:', data, 'Error:', error);
            return { data, error };
        } catch (error) {
            console.error('Error inserting data:', error);
            return { data: null, error };
        }
    }

    function onError(errors: any) {
        console.log("Validation errors:", errors);
    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)} className="w-2/3 space-y-6">
                    {fields.map((field) => (
                        <FormField
                            key={field.name}
                            control={form.control}
                            name={field.name as keyof z.infer<typeof placesSchema>}
                            render={({ field: formField }) => (
                                <FormItem>
                                    <FormLabel>{field.label}</FormLabel>
                                    <FormControl>
                                        <Input {...formField} value={formField.value ?? ''} />
                                    </FormControl>
                                    <FormDescription>
                                        {field.description}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                    <Button type="button" onClick={lookupAddress} disabled={isLoading}>
                        {isLoading ? 'Looking up...' : 'Lookup Address'}
                    </Button>
                    <Button type="submit">Create Court</Button>
                </form>
            </Form>
        </div>
    );
}