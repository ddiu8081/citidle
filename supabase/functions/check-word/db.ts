import { supabase } from '../_shared/supabase.ts'

interface City {
  name: string
  pinyin: string
  lat: number
  lng: number
  province: string
}

export const getCityData = async (cityName: string) => {
  const response = await supabase
    .from('citys')
    .select()
    .eq('name', cityName)
  const city: City = response.data?.[0]
  return city
}

export const getAnswerCityData = async () => {
  const answer = await supabase
    .from('daily_answers')
    .select('date, city (*)')
    .eq('date', new Date().toISOString().split('T')[0])
  const city: City = answer.data?.[0].city
  return city
}