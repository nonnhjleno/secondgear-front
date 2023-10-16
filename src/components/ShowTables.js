import { useContext, useEffect } from "react";
import React from 'react';
import { DatabasesDataContext, TablesContext } from '../App';
import { v4 as uuidv4 } from 'uuid';

const ShowTables = ({ tables, currentSelectedDatabase }) => {
    if (!tables || typeof tables !== 'object') {
        return null;  // もしくは適当なエラーメッセージを返すなど
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
                {Object.values(tables).map((tableName, index) => (
                    <li key={uuidv4()}>{tableName}</li>
                ))}
            </ul>

        </div>
    );
}

export default ShowTables;
