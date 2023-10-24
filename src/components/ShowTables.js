import React from 'react';
import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { currentSelectedDatabaseContext } from '../App';

const ShowTables = ({ tables, handdleSetIsShowing }) => {

    const currentSelectedDatabase = useContext(currentSelectedDatabaseContext);

    if (!tables || typeof tables !== 'object') {
        return null;
    }
    else if (Object.keys(tables).length === 0) {
        return (
            <p>テーブルがありません。</p>
        )
    }

    return (
        <div className=''>
            <h2 className=" text-2xl">{currentSelectedDatabase}</h2>
            <div
                onClick={() => handdleSetIsShowing('createTable')}
            >
                テーブル作成
            </div>
            <ul>
                {Object.values(tables).map((tableName, index) => (
                    <li
                        key={uuidv4()}
                        className={`py-1 w-3/4 ${index % 2 === 0 ? 'bg-slate-200' : ''}`}
                    >
                        {tableName}
                    </li>
                ))}
            </ul>

        </div>
    );
}

export default ShowTables;
