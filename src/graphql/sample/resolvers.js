import pkg from '../../../package.json'
import * as geolib from 'geolib'
require('dotenv').config()

const SERVICE_ID = process.env.SERVICE_ID || pkg.name

//
// Helpers
//
const makeGeoCoordinateId = (lat, lon) => `(${lat}, ${lon})`
const makeGeoCoordinate = ({ latitude, longitude }) => ({
  id: makeGeoCoordinateId(latitude, longitude),
  latitude,
  longitude
})
const makeMetersId = meters => `${meters}m`
const makeMeters = meters => ({ id: makeMetersId(meters), value: meters })
const makeDegreesId = degrees => `${degrees}°`

//
// Resolver implementations
//

//
// Resolvers
//
export const resolver = {
  Query: {
    info: {
      id: SERVICE_ID,
      name: 'MaanaGIS',
      version: pkg.version,
      description: pkg.description
    },

    //
    // Conversions
    //
    sexagesimalToDecimal: (_, { input }) => geolib.sexagesimalToDecimal(input),
    decimalToSexagesimal: (_, { input }) => geolib.decimalToSexagesimal(input),

    //
    // Distances
    //
    distanceD: async (_, { start, end, accuracy }) =>
      makeMeters(
        geolib.getDistance(start, end, accuracy ? accuracy.value : undefined)
      ),

    distanceS: async (_, { start, end, accuracy }) =>
      makeMeters(
        geolib.getDistance(start, end, accuracy ? accuracy.value : undefined)
      ),

    preciseDistanceD: async (_, { start, end, accuracy }) =>
      makeMeters(
        geolib.getPreciseDistance(
          start,
          end,
          accuracy ? accuracy.value : undefined
        )
      ),

    preciseDistanceS: async (_, { start, end, accuracy }) =>
      makeMeters(
        geolib.getPreciseDistance(
          start,
          end,
          accuracy ? accuracy.value : undefined
        )
      ),

    //
    // Centers
    //
    centerD: async (_, { coordinates }) =>
      makeGeoCoordinate(geolib.getCenter(coordinates)),

    centerS: async (_, { coordinates }) =>
      makeGeoCoordinate(geolib.getCenter(coordinates)),

    //
    //
    //
    computeDestinationPointD: async (_, { point, distance, bearing, radius }) =>
      makeGeoCoordinate(
        geolib.computeDestinationPoint(
          point,
          distance.value,
          bearing.value,
          radius ? radius.value : undefined
        )
      )
  }
}
