import { useState, createContext, useEffect } from 'react';
import './App.css';
import DatabasesBar from './components/DatabasesBar';
import axios from 'axios';
import ShowTables from './components/ShowTables';

export const DatabasesDataContext = createContext();

const App = () => {
  const [databasesData, setDatabasesData] = useState([]);
  const [tables, setTables] = useState(null);
  const [currentSelectedDatabase, setCurrentSelectedDatabase] = useState();

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
  }, [currentSelectedDatabase]);

  return (
    <DatabasesDataContext.Provider value={databasesData}>
      <div className='flex'>
      <DatabasesBar setCurrentSelectedDatabase={setCurrentSelectedDatabase} currentSelectedDatabase={currentSelectedDatabase}/>
        <div>
          <ShowTables tables={tables} currentSelectedDatabase={currentSelectedDatabase}/>
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
