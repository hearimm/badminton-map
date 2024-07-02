import React, { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { supabase } from '@/lib/initSupabase'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { FormControl } from "@/components/ui/form"

type Place = {
  id: number
  name: string
}

type PlaceSearchProps = {
  onSelect: (placeId: number) => void
}

export default function PlaceSearch({ onSelect }: PlaceSearchProps) {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
    const [places, setPlaces] = useState<Place[]>([])
  
    console.log('searchTerm:', searchTerm) // 추가된 로그

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchPlaces(debouncedSearchTerm)
    } else {
      setPlaces([])
    }
  }, [debouncedSearchTerm])

  const searchPlaces = async (term: string) => {
    const { data, error } = await supabase
      .from('places')
      .select('id, name')
      .ilike('name', `%${term}%`)
      .limit(10)

    if (error) {
      console.error('Error searching places:', error)
    } else {
      setPlaces(data || [])
    }
  }

  return (
    <FormControl>
      <Command className="rounded-lg border shadow-md">
      
      <CommandInput 
            key="place-search-input"
            placeholder="Search place..." 
            value={searchTerm}
            onValueChange={(value) => console.log(value)}
            />
        <CommandInput 
          placeholder="Search place..." 
          value={searchTerm}
          onValueChange={(value) => {
            console.log('onValueChange:', value) // 추가된 로그
            setSearchTerm(value)
          }}
        />
        {/* ... 나머지 코드 */}
      </Command>
    </FormControl>
  )
}