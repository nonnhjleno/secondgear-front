import { useState, createContext, useEffect } from 'react';
import './App.css';
import DatabasesBar from './components/DatabasesBar';
import axios from 'axios';
import ShowTables from './components/ShowTables';
import CreateDatabase from './components/CreateDatabase';
import CreateTable from './components/CreateTable'

//TODO 裏で動いてるコマンドを表示するできるかもしれない
//TODO テーブル作成画面からテーブル表示画面に戻るアルゴリズム作成

export const DatabasesDataContext = createContext();
export const currentSelectedDatabaseContext = createContext();

const App = () => {
  const [databasesData, setDatabasesData] = useState([]);
  const [tables, setTables] = useState(null);
  const [currentSelectedDatabase, setCurrentSelectedDatabase] = useState();

  const [isShowing, setIsShowing] = useState('initial');
  const [createTableFlag, setCreateTableFlag] = useState(false);

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
      });
    setCreateTableFlag(false);
  }, [currentSelectedDatabase, databasesData, createTableFlag]);

  const handleSetIsShowing = status => {
    console.log(`${status}を表示します`);
    setIsShowing(status);
  }

  return (
    <DatabasesDataContext.Provider value={databasesData}>
      <currentSelectedDatabaseContext.Provider value={currentSelectedDatabase}>
        <div className='flex'>
          <div id='sidebar' className='flex flex-col'>
            <div
              onClick={() => handleSetIsShowing('initial')}
              className={` py-3 px-5 ${isShowing === 'initial' ? 'bg-slate-200 ' : ''}`}
            // onMouseEnter={event => {
            //   if (isShowing === 'initial') {
            //     event.target.classList.remove('bg-slate-200');
            //     event.target.classList.add('bg-slate-300');
            //   }
            //   else {
            //     event.target.classList.add('bg-slate-200');
            //   }
            // }}
            // onMouseLeave={event => {
            //   if (isShowing === 'initial') {
            //     event.target.classList.remove('bg-slate-300');
            //     event.target.classList.add('bg-slate-200');
            //   }
            //   else {
            //     event.target.classList.remove('bg-slate-200');
            //   }
            // }}
            >
              データベース作成
            </div>
            <DatabasesBar setCurrentSelectedDatabase={setCurrentSelectedDatabase} />
          </div>
          <div id='outerOfMain' className=''>
            <div id="main">
              <div id="tabs">
                <div>
                  <p className={`${isShowing === 'initial' ? 'hidden ' : 'py-3 px-5 mb-5 bg-slate-200'} `} style={{ width: "15%", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentSelectedDatabase}
                  </p>
                </div>
              </div>
              {(isShowing === 'initial') && (
                <CreateDatabase />
              )}
              {(isShowing === 'tables') && (
                <ShowTables tables={tables} handleSetIsShowing={handleSetIsShowing} />
              )}
              {(isShowing === 'createTable') && (
                <div>
                  <button onClick={() => setIsShowing('tables')}><p className=' text-lg'>←</p></button>
                  <CreateTable setCreateTableFlag={setCreateTableFlag} />
                </div>
              )}
            </div>
          </div>
        </div>
      </currentSelectedDatabaseContext.Provider>
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
