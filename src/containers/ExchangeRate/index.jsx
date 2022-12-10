import React from 'react';
import { Table } from 'components/common';
import { ExchangeRateRow } from 'components/table';
import { IExchangeRateRowData } from 'components/table/rows/ExchangeRateRow/models';
import { useExchangeRate } from 'hooks/useExhangeRate';
import { apiExchangeRateToTableItem } from './adapters';
import { tableHeaders } from './config';

import './exchangeRates.sass';

const ExchangeRates = () => {
    const { data, isFetching, fetchExchangeRate } = useExchangeRate();

    React.useEffect( () => {
        if (!data) {
            fetchExchangeRate();
        }
    }, []);

    const tableData = React.useMemo(() => {
        return data?.map(apiExchangeRateToTableItem) || [];
    }, [data]);

    const renderLoader = () => (
        <div>Loading...</div>
    );

    const renderContent = () => (
        <>
            <Table
                headers={tableHeaders}
                data={tableData}
                renderRow={(row: IExchangeRateRowData) => <ExchangeRateRow key={row.name} data={row} />}
            />
            <button onClick={fetchExchangeRate}>Re-fetch</button>
        </>
    );

    return (
        <div className="exchangeRates">
            {isFetching ? renderLoader() : renderContent()}
        </div>
    );
};

export default ExchangeRates;
