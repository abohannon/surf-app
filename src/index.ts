import request from 'request-promise-native'
import buoyPropMap from './buoy-prop-map'

const fetchStationBuoyData = async (stationId: number): Promise<string> => {
  const noaaRealtimeUri = `https://www.ndbc.noaa.gov/data/realtime2/${stationId}.txt`
  try {
    return request(noaaRealtimeUri)
  } catch (err) {
    console.log(err)
    throw new Error(`Error fetching data`)
  }
}

const createArrayFromRawBuoyData = (rawBuoyData: string): string[][] => {
  return rawBuoyData.split('\n').map((line) => line.replace(/\s{2,}/g, ' ').replace('#', '').split(' '))
}

interface buoyDataInterface {
  date: Date,
}

const buildBuoyDataObject = (buoyData: buoyDataInterface, prop: string, value: any): void => {
    switch (prop) {
      case `year`:
        buoyData.date.setUTCFullYear(value)
        break
      case `month`:
        buoyData.date.setUTCMonth(value - 1)
        break
      case `day`:
        buoyData.date.setUTCDate(value)
        break
      case `hour`:
        buoyData.date.setUTCHours(value)
        break
      case `minute`:
        buoyData.date.setUTCMinutes(value)
        break
      default:
        buoyData[prop] = value
    }
  }

const createObjectFromBuoyDataArray = (buoyDataArray: string[][], dataHead: string[]): object[] => {
  return buoyDataArray.map((line) => {
    return line.reduce((acc, value, i) => {
        const prop = dataHead[i]
        const propVerbose = buoyPropMap[prop]

        if (propVerbose) {
          buildBuoyDataObject(acc, propVerbose, value)
        }

        return acc
    }, { date: new Date() })
  })
}

const formatBuoyData = async (): Promise<void> => {
  const rawBuoyData = await fetchStationBuoyData(46258)
  const buoyDataArray = createArrayFromRawBuoyData(rawBuoyData)
  // isolate the data header properties
  const dataHead = buoyDataArray.shift()
  // clean up buoy data by removing unnecessary data labels
  buoyDataArray.shift()
  const formattedBuoyData = createObjectFromBuoyDataArray(buoyDataArray, dataHead)
  console.log('formattedBuoyData', formattedBuoyData)
}

formatBuoyData()


