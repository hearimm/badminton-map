"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { format, addHours, parseISO } from 'date-fns'
import { format as formatTz } from 'date-fns-tz'

import Header from "@/components/header"
import { supabase } from "@/lib/initSupabase"
import PlaceSearchModal from "@/components/placeSearchModal"
import { getSession } from "@/app/login/actions"

const FormSchema = z.object({
  max: z.number().int().positive().max(100).optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식을 사용하세요."),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "시간 형식이 올바르지 않습니다. HH:MM 형식을 사용하세요."),
  duration: z.number().int().positive().max(24).default(2),
  level: z.string().optional(),
  level_template: z.string().optional(),
  min_level: z.number().int().min(0).max(100),
  max_level: z.number().int().min(0).max(100),
  place_id: z.number().int().positive(),
  description: z.string().max(500).optional(),
  manager_id: z.string().uuid().optional(),
}).refine(data => data.min_level <= data.max_level, {
  message: "최소 레벨은 최대 레벨보다 클 수 없습니다.",
  path: ["min_level"],
});

type FormValues = z.infer<typeof FormSchema>;

const levelRanges = [
  { name: "랠리 가능자", minLevel: 1, maxLevel: 10 },
  { name: "룰 숙지자", minLevel: 11, maxLevel: 20 },
  { name: "왕왕초심", minLevel: 21, maxLevel: 30 },
  { name: "왕초심", minLevel: 31, maxLevel: 40 },
  { name: "초심", minLevel: 41, maxLevel: 50 },
  { name: "D조", minLevel: 51, maxLevel: 60 },
  { name: "C조", minLevel: 61, maxLevel: 70 },
  { name: "B조", minLevel: 71, maxLevel: 80 },
  { name: "A조", minLevel: 81, maxLevel: 100 },
]

const levelCategories = [
  { name: "누구나", minLevel: 0, maxLevel: 100 },
  { name: "룰 숙지자 이상 누구나", minLevel: 11, maxLevel: 100 },
  { name: "초심 까지", minLevel: 0, maxLevel: 50 },
  { name: "초심 이상 누구나", minLevel: 41, maxLevel: 100 },
  { name: "D조 이상 누구나", minLevel: 51, maxLevel: 100 },
  { name: "C조 이상 누구나", minLevel: 61, maxLevel: 100 },
  { name: "B조 이상 누구나", minLevel: 71, maxLevel: 100 },
  { name: "A조 이상 누구나", minLevel: 81, maxLevel: 100 },
]

export default function ScheduleCreatePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<{ id: number; name: string } | null>(null)
  const [levelRange, setLevelRange] = useState([0, 100])
  const [customLevelDescription, setCustomLevelDescription] = useState("")

  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      max: 10,
      start_date: format(new Date(), 'yyyy-MM-dd'),
      start_time: '19:00',
      duration: 2,
      level: "누구나",
      level_template: "누구나",
      min_level: 0,
      max_level: 100,
      description: '',
    },
  })

  const updateLevelDescription = (min: number, max: number) => {
    const minLevelName = levelRanges.find(range => min >= range.minLevel && min <= range.maxLevel)?.name || "미정";
    const maxLevelName = levelRanges.find(range => max >= range.minLevel && max <= range.maxLevel)?.name || "미정";
    
    if (min === 0 && max === 100) {
      return "누구나";
    } else if (min === 0) {
      return `${maxLevelName} 까지`;
    } else if (max === 100) {
      return `${minLevelName} 이상 누구나`;
    } else {
      return `${minLevelName} 이상 ${maxLevelName} 이하`;
    }
  };

  useEffect(() => {
    const selectedTemplate = form.watch("level_template")
    const category = levelCategories.find(cat => cat.name === selectedTemplate)
    if (category) {
      form.setValue("min_level", category.minLevel)
      form.setValue("max_level", category.maxLevel)
      setLevelRange([category.minLevel, category.maxLevel])
      setCustomLevelDescription(category.name)
    }
  }, [form])

  useEffect(() => {
    console.log("levelRange changed:", levelRange); // levelRange가 변경될 때마다 로그 출력

    const description = updateLevelDescription(levelRange[0], levelRange[1])
    setCustomLevelDescription(description)
    form.setValue("level", description)
    form.setValue("level_template", description)
    
    console.log("levelRange changed level:", form.getValues('level')); // levelRange가 변경될 때마다 로그 출력
    console.log("levelRange changed level_template:", form.getValues('level_template')); // levelRange가 변경될 때마다 로그 출력
  }, [levelRange, form])

  async function filterFormData(data: FormValues) {
    const { level_template, start_date, start_time, duration, ...filteredData } = data;
    
    const localDateTime = parseISO(`${start_date}T${start_time}:00`);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const startTimeWithZone = formatTz(localDateTime, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone });
    const endDateTime = addHours(localDateTime, duration);
    const endTimeWithZone = formatTz(endDateTime, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone });

    // Get current user ID
    // 현재 세션에서 사용자 정보 가져오기
    const { session } = await getSession();
    // const session = data.session;

    if (!session) {
      throw new Error('No active session. User must be logged in.');
    }

    const userId = session.user.id;

    return {
      ...filteredData,
      date: start_date,
      time: start_time,
      start_time: startTimeWithZone,
      end_time: endTimeWithZone,
      created_user: userId,
      modified_user: userId,
      manager_id: userId,
    };
  }

  async function onSubmit(data: FormValues) {
    const filteredData = await filterFormData(data);
    setIsSubmitting(true)
    try {
      // Start a transaction by using single batch
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .insert([filteredData])
        .select()
        .single();

      if (matchError) throw matchError;

      // Insert manager into participants table
      const { error: participantError } = await supabase
        .from('participants')
        .insert([{
          match_id: match.id,
          user_id: match.manager_id,
          status: 'attending'
        }]);

      if (participantError) throw participantError;

      toast({
        title: "Match created successfully",
        description: "Your new match has been added to the schedule.",
      })
      router.push('/match')
    } catch (error) {
      console.error("Error creating match:", error)
      toast({
        title: "Error",
        description: "Failed to create match. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLevelRangeChange = (newRange: number[]) => {
    setLevelRange(newRange)
    form.setValue('min_level', newRange[0])
    form.setValue('max_level', newRange[1])
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="max-w-2xl mx-auto w-full">
          <h1 className="text-2xl font-bold mb-6">Create New Match</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, (e) => console.error(e))} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="place_id"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Place</FormLabel>
                      <div className="flex items-center gap-2">
                        <Input 
                          readOnly 
                          value={selectedPlace?.name || ''} 
                          placeholder="No place selected"
                        />
                        <PlaceSearchModal 
                          onSelect={(placeId: number, placeName: string) => {
                            field.onChange(placeId)
                            setSelectedPlace({ id: placeId, name: placeName })
                          }} 
                        />
                      </div>
                      <FormDescription>
                        Select the place where the match will be held.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (hours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="level_template"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>레벨 템플릿</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="레벨 템플릿 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {levelCategories.map((category) => (
                            <SelectItem key={category.name} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        선택한 레벨 템플릿: {field.value}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="min_level"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>레벨 범위 조정</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Slider
                            min={0}
                            max={100}
                            step={10}
                            value={levelRange}
                            defaultValue={[0,100]}
                            onValueChange={handleLevelRangeChange}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm">
                            <span>Min: {levelRange[0]}</span>
                            <span>Max: {levelRange[1]}</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        현재 설정: {customLevelDescription}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Participants</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
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
                      <Textarea placeholder="Enter match details..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Match"}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  )
}
