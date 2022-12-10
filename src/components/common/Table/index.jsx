import React from 'react';
import { ITable } from './models';

import './table.sass';

const Table = ({
    headers = [],
    data = [],
    renderRow,
}: ITable) => {
    const renderHead = () => {
        const headCells = headers.map((item) => <th key={item}>{item}</th>);

        return (
            <thead>
                <tr>{headCells}</tr>
            </thead>
        );
    };

    const bodyContent = React.useMemo(() => {
        const rows = data.map(renderRow);

        return (
            <tbody>{rows}</tbody>
        );
    }, [data, renderRow]);

    return (
        <table className="tableComponent">
            {renderHead()}
            {bodyContent}
        </table>
    );
};

export default Table;
