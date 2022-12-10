import React from 'react';
import { Table } from 'components/common';
import { ExchangeRatesRow } from 'components/table';
import { IExchangeRatesRowData } from 'components/table/rows/ExchangeRatesRow/models';
import { useExchangeRates } from 'hooks/useExchangeRates';
import { apiExchangeRatesItemToTableItem } from './adapters';
import { tableHeaders } from './config';

import './exchangeRates.sass';

const ExchangeRates = () => {
    const { data, error, isFetching, fetchExchangeRates } = useExchangeRates();

    React.useEffect( () => {
        const isFirstRenderWithoutLocalStorageData = !data && !error && !isFetching;

        if (isFirstRenderWithoutLocalStorageData) {
            fetchExchangeRates();
        }
    }, [data, error, isFetching, fetchExchangeRates]);

    const tableData = React.useMemo(() => {
        return data?.map(apiExchangeRatesItemToTableItem) || [];
    }, [data]);

    const renderLoader = () => (
        <div>Loading...</div>
    );

    const renderContent = () => (
        <>
            <Table
                headers={tableHeaders}
                data={tableData}
                renderRow={(row: IExchangeRatesRowData) => <ExchangeRatesRow key={row.name} data={row} />}
            />
            <button onClick={fetchExchangeRates}>Re-fetch</button>
        </>
    );

    return (
        <div className="exchangeRates">
            {isFetching ? renderLoader() : renderContent()}
        </div>
    );
};

export default ExchangeRates;
