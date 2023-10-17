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
    if (currentSelectedDatabase === undefined) return;
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

  return (
    <DatabasesDataContext.Provider value={databasesData}>
      <div className='flex'>
        <div id='sidebar'>
          <button onClick={() => setIsShowing('initial')}>データベース作成</button>
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
    </DatabasesDataContext.Provider>
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
