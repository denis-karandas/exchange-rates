import { IExchangeRateResponse } from 'hooks/useExhangeRate/models';
import { IExchangeRateRowData } from 'components/table/rows/ExchangeRateRow/models';

export const apiExchangeRateToTableItem = (item: IExchangeRateResponse): IExchangeRateRowData => ({
    name: item.cc,
    rate: item.rate.toString()
});
