import { WebService } from "./WebService";
import Environment from "../../environment";
import { DEFAULT_CURRENCY } from 'core/config/currencies'

const DEFUALT_HISTORICAL_PRICE_CONFIG = {
  data: {
    currency_from: DEFAULT_CURRENCY.currency,
    currency_to: "USD",
    amount_days: 45,
  },
};

const DEFAULT_URL = `${Environment.CountryApIUrl}cryptoCompares/get-daily-historical-data`;

export class HistoricalPriceService extends WebService {
  constructor(url = DEFAULT_URL, config = DEFUALT_HISTORICAL_PRICE_CONFIG) {
    super();
    this.historicalUrl = url;
    this.config = config;
  }

  async init() {
    const historicalPrices = await this.Post(this.historicalUrl, this.config);
    const { historical_data } = historicalPrices.data;
    const result = { priceList: [], dateList: [] };

    this.historicalPrices = historical_data.reduce((result, value) => {
      result.priceList.push(value.close_price);
      result.dateList.push(value.date);
      return result;
    }, result);
  }

  get historicalPrices() {
    return this.historicalPrices;
  }
}
