"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

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
import { Database } from "@/supabase/types";
import { placesSchema } from "@/schema/placesSchema";

type Places = Database['public']['Tables']['places']['Row'];

type UpdateCourtFormProps = {
  initialData: Places;
};

const formSchema = placesSchema.extend({
  additionalInfoArray: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    })
  ),
});

export default function UpdateCourtForm({ initialData }: UpdateCourtFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressSearchInput, setAddressSearchInput] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialData,
      place_name: initialData.place_name || '',
      address: initialData.address || '',
      additionalInfoArray: Object.entries(initialData.additional_info || {}).map(([key, value]) => ({ key, value: String(value) })),
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
    setIsSubmitting(true);
    const additionalInfo = Object.fromEntries(
      data.additionalInfoArray.map(({ key, value }) => [key, value])
    );

    const updateData = {
      ...data,
      additional_info: additionalInfo,
    };

    delete updateData?.additionalInfoArray;

    const result = await updatePlaceData(updateData);
    setIsSubmitting(false);

    if (result.error) {
      toast({
        title: "Error",
        description: "Failed to update. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Update successful",
        description: "The court information has been updated.",
      });
    }
  }

  async function updatePlaceData(param: Omit<z.infer<typeof formSchema>, 'additionalInfoArray'>) {
    const { data, error } = await supabase
      .from('places')
      .update(param)
      .eq('place_id', param.place_id)
      .select('*');

    return { data, error };
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="place_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>The name of the place.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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

          <div>
            <FormLabel>Additional Information</FormLabel>
            {fields.map((field, index) => (
              <div key={field.id} className="flex space-x-2 mt-2">
                <FormField
                  control={form.control}
                  name={`additionalInfoArray.${index}.key`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="Key" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`additionalInfoArray.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="Value" />
                      </FormControl>
                      <FormMessage />
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
              className="mt-2"
            >
              Add Field
            </Button>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </form>
      </Form>
    </div>
  );
}