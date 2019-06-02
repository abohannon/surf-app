const buoyPropMap = require('./buoy-prop-map')

const data = `#YY  MM DD hh mm WDIR WSPD GST  WVHT   DPD   APD MWD   PRES  ATMP  WTMP  DEWP  VIS PTDY  TIDE
#yr  mo dy hr mn degT m/s  m/s     m   sec   sec degT   hPa  degC  degC  degC  nmi  hPa    ft
2019 06 02 01 30  MM   MM   MM   0.9    14   7.5 185     MM    MM  17.7    MM   MM   MM    MM
2019 06 02 01 00  MM   MM   MM   0.9    13   7.4 188     MM    MM  17.7    MM   MM   MM    MM
2019 06 02 00 30  MM   MM   MM   1.0    14   7.9 187     MM    MM  17.7    MM   MM   MM    MM
2019 06 02 00 00  MM   MM   MM   1.1    13   8.4 191     MM    MM  17.6    MM   MM   MM    MM
2019 06 01 23 30  MM   MM   MM   1.0    15   8.0 190     MM    MM  17.7    MM   MM   MM    MM
2019 06 01 23 00  MM   MM   MM   1.0    14   8.3 191     MM    MM  17.7    MM   MM   MM    MM
2019 06 01 22 30  MM   MM   MM   1.0    14   8.2 205     MM    MM  17.7    MM   MM   MM    MM
2019 06 01 22 00  MM   MM   MM   1.0    13   8.3 202     MM    MM  17.7    MM   MM   MM    MM
2019 06 01 21 30  MM   MM   MM   0.9    14   7.6 184     MM    MM  17.5    MM   MM   MM    MM
2019 06 01 21 00  MM   MM   MM   1.0    14   8.2 190     MM    MM  17.4    MM   MM   MM    MM`


const buoyDataArray = data
  .split('\n')
  .map((line) => line.replace(/\s{2,}/g, ' ').replace('#', '').split(' '))

// isolate the data header properties
const dataHead = buoyDataArray.shift()

// clean buoy data by removing data labels
buoyDataArray.shift()

const buildBuoyDataObject = (buoyData, prop, value) => {
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

const buoyData = buoyDataArray.map((line) => {
  return line.reduce((acc, value, i) => {
      const prop = dataHead[i]
      const propVerbose = buoyPropMap[prop]

      if (propVerbose) {
        buildBuoyDataObject(acc, propVerbose, value)
      }

      return acc
  }, { date: new Date() })
})

console.log(buoyData)
