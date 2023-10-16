import React, { useContext } from 'react';
import { DatabasesDataContext } from '../App';
import { v4 as uuidv4 } from 'uuid';

const DatabasesBar = ({ setCurrentSelectedDatabase }) => {
    const DatabasesData = useContext(DatabasesDataContext);

    // const handleSetDatabaseName = event => {
    //     if (event.target.innerHTML === "データベース作成") {
    //         createDatabaseFlag = true;
    //         return 0;
    //     }
    //     createDatabaseFlag = false;
    //     setCurrentDatabaseName(event.target.innerHTML);
    // }
    if(DatabasesData === undefined) return ;
    
    return (
        <div>
            <ul className='mx-8 list-none'>
                <li>データベース作成</li>
                {Object.keys(DatabasesData).map((key) => (
                    <li className='my-2' key={uuidv4()} onClick={() => setCurrentSelectedDatabase(key)}>
                        {key}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DatabasesBar;
