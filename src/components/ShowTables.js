import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const ShowTables = ({ tables, currentSelectedDatabase }) => {
    if (!tables || typeof tables !== 'object') {
        return null;
    }
    else if (Object.keys(tables).length === 0) {
        return (
            <p>テーブルがありません。</p>
        )
    }

    return (
        <div>
            <h2 className=" text-2xl">{currentSelectedDatabase}</h2>
            <ul>
                {Object.values(tables).map(tableName => (
                    <li key={uuidv4()}>{tableName}</li>
                ))}
            </ul>

        </div>
    );
}

export default ShowTables;
