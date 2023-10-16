import { useContext, useEffect } from "react";
import React from 'react';
import { DatabasesDataContext, TablesContext } from '../App';
import { v4 as uuidv4 } from 'uuid';

const ShowTables = ({ tables }) => {
    console.log(tables);

    if (!tables || typeof tables !== 'object') {
        return null;  // もしくは適当なエラーメッセージを返すなど
    }
    else if (Object.keys(tables).length === 0){
        return (
            <p>テーブルがありません。</p>
        )
    }

    return (
        <ul>
            {Object.values(tables).map((tableName, index) => (
                <li key={uuidv4()}>{tableName}</li>
            ))}
        </ul>
    );
}

export default ShowTables;
