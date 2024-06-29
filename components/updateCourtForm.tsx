"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

export default function UpdateCourtForm({ initialData }: UpdateCourtFormProps) {
  const form = useForm<z.infer<typeof placesSchema>>({
    resolver: zodResolver(placesSchema),
    defaultValues: {
      ...initialData,
      name: initialData.name || '', // Ensure 'name' is not null
      address: initialData.address || '', // Ensure 'address' is not null
      courts: initialData.courts || '', // Ensure 'courts' is not null
    },

  });

  async function onSubmit(data: z.infer<typeof placesSchema>) {
    console.log(data);
    const result = await updateData(data);
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
        title: "Update successful",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(result.data, null, 2)}</code>
          </pre>
        ),
      });
    }
  }

  async function updateData(param: z.infer<typeof placesSchema>) {
    const { data, error } = await supabase
      .from('places')
      .update(param)
      .eq('id', param.id)
      .select('*');

    console.log('Update Result:', data, 'Error:', error);
    return { data, error };
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  This is the name of the club.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  This is the address of the club.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="courts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Courts</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  Number of courts available.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Add more fields as needed */}
          <Button type="submit">Update</Button>
        </form>
      </Form>
    </div>
  );
}
