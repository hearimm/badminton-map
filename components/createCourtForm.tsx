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

import { placesSchema } from "@/schema/placesSchema";

export default function CreateCourtForm() {
    const form = useForm<z.infer<typeof placesSchema>>({
        resolver: zodResolver(placesSchema),
        defaultValues: {
            name: "", // Ensure 'name' is not null
            address: "", // Ensure 'address' is not null
            courts: "", // Ensure 'courts' is not null
        },
    });

    async function onSubmit(data: z.infer<typeof placesSchema>) {
        console.log(data);
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
        const { data, error } = await supabase
            .from('places')
            .insert(param)
            .select('*');

        console.log('Insert Result:', data, 'Error:', error);
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
                    <Button type="submit">Create Court</Button>
                </form>
            </Form>
        </div>
    );
}
