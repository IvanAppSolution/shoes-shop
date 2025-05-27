import { parseAsFloat, createLoader, parseAsString } from 'nuqs/server'
 
// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const coordinatesSearchParams = {
  id: parseAsString.withDefault(""),
  search: parseAsString.withDefault(""),
  brand: parseAsString.withDefault(""),
  perPage: parseAsFloat.withDefault(Number(process.env.PAGINATION_PER_PAGE) || 10),  
  offset: parseAsFloat.withDefault(0),
}
 

export const loadSearchParams = createLoader(coordinatesSearchParams)
