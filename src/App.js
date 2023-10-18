import { useState, createContext, useEffect } from 'react';
import './App.css';
import DatabasesBar from './components/DatabasesBar';
import axios from 'axios';
import ShowTables from './components/ShowTables';
import CreateDatabase from './components/CreateDatabase';

export const DatabasesDataContext = createContext();

const App = () => {
  const [databasesData, setDatabasesData] = useState([]);
  const [tables, setTables] = useState(null);
  const [currentSelectedDatabase, setCurrentSelectedDatabase] = useState();

  const [isShowing, setIsShowing] = useState('initial');

  useEffect(() => {
    fetchDatabases()
      .then(result => {
        setDatabasesData(result);
      })
      .catch(error => {
        console.error('APIへのリクエストが失敗しました:', error);
      });
  }, []);

  useEffect(() => {
    if (currentSelectedDatabase === undefined || currentSelectedDatabase === '__initial__') return;
    setIsShowing('tables');
    fetchTables(currentSelectedDatabase)
      .then(result => {
        let prevDatabasesData = databasesData;
        prevDatabasesData[currentSelectedDatabase] = { ...result };
        setTables({ ...result });
        setDatabasesData(prevDatabasesData);
      })
      .catch(error => {
        console.error(error);
      })
  }, [currentSelectedDatabase, databasesData]);

  const handleCreateDatabaseBtn = () => {
    setIsShowing('initial');
    setCurrentSelectedDatabase('__initial__');
  }

  return (
    <DatabasesDataContext.Provider value={databasesData}>
      <div className='flex'>
        <div id='sidebar'>
          {/* TODO:クリックしたときに色が付きません */}
          <div
            onClick={() => handleCreateDatabaseBtn()}
            className={`p-2 ${isShowing === 'initial' ? 'bg-slate-200 ' : ''}`}
            onMouseEnter={event => {
              if (isShowing === 'initial') {
                event.target.classList.remove('bg-slate-200');
                event.target.classList.add('bg-slate-300');
              }
              else {
                event.target.classList.add('bg-slate-200');
              }
            }}
            onMouseLeave={event => {
              if (isShowing === 'initial') {
                event.target.classList.remove('bg-slate-300');
                event.target.classList.add('bg-slate-200');
              }
              else {
                event.target.classList.remove('bg-slate-200');
              }
            }}
          >
            データベース作成
          </div>
          <DatabasesBar setCurrentSelectedDatabase={setCurrentSelectedDatabase} currentSelectedDatabase={currentSelectedDatabase} />
        </div>
        <div>
          {(isShowing === 'initial') && (
            <CreateDatabase />
          )}
          {(isShowing === 'tables') && (
            <ShowTables tables={tables} currentSelectedDatabase={currentSelectedDatabase} />
          )}
        </div>
      </div>
    </DatabasesDataContext.Provider >
  );
}

export default App;

const fetchDatabases = async () => {
  try {
    const response = await axios.get('http://localhost:3000');
    return response.data;
  } catch (error) {
    console.error('APIへのリクエストが失敗しました:', error);
  }
};

const fetchTables = async (databaseName) => {
  if (databaseName === undefined) {
    return;
  }

  try {
    const response = await axios.get('http://localhost:3000/showTables/' + databaseName);
    return response.data;
  } catch (error) {
    console.error('APIへのリクエストが失敗しました:', error);
  }
}
