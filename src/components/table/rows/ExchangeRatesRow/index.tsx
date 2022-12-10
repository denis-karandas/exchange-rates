import React from 'react';
import { IExchangeRatesRow } from './models';

const ExchangeRatesRow = ({ data }: IExchangeRatesRow) => {
    const [name, setName] = React.useState<string>(data.name);
    const [rate, setRate] = React.useState<string>(data.rate);

    return (
        <tr>
            <td>
                <input name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </td>
            <td>
                <input name="rate" type="text" value={rate} onChange={(e) => setRate(e.target.value)} />
            </td>
        </tr>
    );
};

export default ExchangeRatesRow;
