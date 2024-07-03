import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from '@/lib/initSupabase'

type Place = {
  id: number
  name: string
  address: string
}

type PlaceSearchModalProps = {
  onSelect: (placeId: number, placeName: string) => void
}

export default function PlaceSearchModal({ onSelect }: PlaceSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [places, setPlaces] = useState<Place[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const searchPlaces = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('places')
      .select('id, name, address')
      .ilike('name', `%${searchTerm}%`)
      .limit(10)

    if (error) console.error('Error searching places:', error)
    else setPlaces(data || [])
    setIsLoading(false)
  }

  const handleSelect = (placeId: number, placeName: string) => {
    onSelect(placeId, placeName)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Select Place</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Place</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search places..."
            />
            <Button onClick={searchPlaces} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {places.map((place) => (
              <div
                key={place.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(place.id, place.name)}
              >
                <div>{place.name}</div>
                <div className="text-sm text-gray-500">{place.address}</div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}