import Environment from "../../environment";

const {
  IdentityApIUrl,
  CountryUrl
} = Environment

export const API_FETCH_SELECT_LIST = {
  location_country:"getCountryList",
  country:"getCountryList",
  nationality:"getCountryList",
  province:"getProvinceList",
  city:"getCityList",
  id_type:"createAvailableIdentityList",
  withdrawProviderBank:"getBankList"
}

export const NEXT_SELECT_LIST = {
  location_country:"province",
  province:"city",
  nationality:"id_type",
}

export const PRIMARY_COLOR = '#00ffc4'
export const COUNTRY_URL_API = IdentityApIUrl
export const INFO_URL_API = CountryUrl


