import React, { useContext } from 'react';
import { DatabasesDataContext } from '../App';
import { v4 as uuidv4 } from 'uuid';

const DatabasesBar = ({ setCurrentSelectedDatabase, currentSelectedDatabase }) => {
    const DatabasesData = useContext(DatabasesDataContext);
    if (DatabasesData === undefined) return;

    return (
        <div className='mt-10'>
            <ul className='list-none'>
                {Object.keys(DatabasesData).map((key) => (
                    <li
                        className={`p-2 ${currentSelectedDatabase === key ? 'bg-slate-100 ' : ''}`}
                        key={uuidv4()}
                        onClick={() => setCurrentSelectedDatabase(key)}
                        onMouseEnter={event => {
                            if (currentSelectedDatabase === key) {
                                event.target.classList.remove('bg-slate-100');
                                event.target.classList.add('bg-slate-200');
                            }
                            else{
                                event.target.classList.add('bg-slate-100');
                            }
                        }}
                        onMouseLeave={event => {
                            if (currentSelectedDatabase === key) {
                                event.target.classList.remove('bg-slate-200');
                                event.target.classList.add('bg-slate-100');
                            }
                            else{
                                event.target.classList.remove('bg-slate-100');
                            }
                        }}
                    >
                        {key}
                    </li>
                ))}
            </ul>
        </div >
    );
}

export default DatabasesBar;
