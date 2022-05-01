import Environment from "../../environment";

const {
  IdentityApIUrl
} = Environment

export const API_FETCH_SELECT_LIST = {
  location_country:"getCountryList",
  country:"getCountryList",
  province:"getProvinceList",
  city:"getCityList"
}

export const NEXT_SELECT_LIST = {
  location_country:"province",
  province:"city"
}

export const PRIMARY_COLOR = '#00ffc4'
export const COUNTRY_URL_API = IdentityApIUrl
export const INFO_URL_API = 'https://info.bitsenda.com'


