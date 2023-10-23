import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const ShowTables = ({ tables, currentSelectedDatabase, handdleSetIsShowing }) => {
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
            <div
            onClick={() => handdleSetIsShowing('createTable')}
            >
                テーブル作成
            </div>
            <ul>
                {Object.values(tables).map(tableName => (
                    <li key={uuidv4()}>{tableName}</li>
                ))}
            </ul>

        </div>
    );
}

export default ShowTables;
