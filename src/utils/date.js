import BigNumber from "bignumber.js";

const isIsoDate = /[0-9]{4}-[0-9]{2}-[0-9]{2}/g
const isMaskDate = /[0-9]{2}[/][0-9]{2}[/][0-9]{4}/g

const TIME_UNITS = {
  seconds:(difference) => parseInt(difference / 1000),
  minutes:(difference) => parseInt(difference / 1000 / 60),
}

export const timeDifference = (date, timeUnitType = "seconds") => {
    var now = new Date();
    var diff = now - date;
    return TIME_UNITS[timeUnitType](diff)
}


const checkMaskDate = date => {
  if(!date)return;
  return date.match(isMaskDate)
}

export const formatMaskDate = date => {
  if(!checkMaskDate(date))return date;
  let _date = date.split("/")
  const day = _date[0]
  const month = _date[1]
  const year = _date[2]
  return `${year}-${month}-${day}`
}

export const parseTimeStampToDate = (timeStamp) => {
    if(timeStamp.includes("-")) return timeStamp;
    let date = new Date(new BigNumber(timeStamp).multipliedBy(1000).toNumber()).toISOString()
    const isoDate = date.match(isIsoDate)
    return isoDate && isoDate[0]
  }

export const parseDateToTimeStamp = date => {
    if(!date?.match(isIsoDate))return date
    const { year, month, day } = formatJsonUTFDate(date)
    const timeStamp = new Date(year, month, day).getTime()
    return BigNumber(timeStamp).div(1000).toString()
  }
    
  export const formatJsonUTFDate = date => {
    if(!date?.match(isIsoDate))return date
    let _date = date.split("-")
    const year = _date[0]
    const month = (parseInt(_date[1]) - 1)
    const day = _date[2]
    return {
      day,
      month,
      year
    }
  }