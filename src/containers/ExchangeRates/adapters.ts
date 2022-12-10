import { IExchangeRatesResponse } from 'hooks/useExchangeRates/models';
import { IExchangeRatesRowData } from 'components/table/rows/ExchangeRatesRow/models';

export const apiExchangeRatesItemToTableItem = (item: IExchangeRatesResponse): IExchangeRatesRowData => ({
    name: item.cc,
    rate: item.rate.toString()
});
