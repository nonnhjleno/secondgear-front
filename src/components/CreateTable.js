import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { currentSelectedDatabaseContext } from '../App.js';
const CreateTable = () => {
  const currentSelectedDatabase = useContext(currentSelectedDatabaseContext);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ name: '', columnNum: 3 });

  const {
    register,
    handleSubmit,
    // setValue,
    formState: { errors },
    setValue
  } = useForm({
    criteriaMode: 'all',
    defaultValues: {
      name: data.name,
      columnNum: data.columnNum,
    },
  });

  const handleOnSubmit = formData => {
    // console.log(formData.name, formData.columnNum);
    setData(formData);
    setPage(2);
  };

  const handleOnError = errors => console.log(errors);

  if (page === 1) {

    console.log({ ...register('columnNum') });
    return (
      <form onSubmit={handleSubmit(handleOnSubmit, handleOnError)}>
        <h1>{currentSelectedDatabase}</h1>
        <div>
          <label htmlFor="name">テーブル名: </label>
          <input
            {...register('name', {
              required: 'テーブル前を入力してください',
            })}
            id='tableName'
            type="text"
            className="border-2 border-black rounded"
          />
          {errors.name && <p className="text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="name">カラムの個数: </label>
          <input
            {...register('columnNum')}
            type="number"
            min={1}
            max={255}
            className="border-2 border-black rounded"
          />
        </div>
        <button type="submit" className="border-2 border-black rounded">
          送信
        </button>
      </form>
    );
  } else if (page === 2) {
    const columnComponents = [];

    console.log(data.columnNum);

    for (let i = 0; i < data.columnNum; i++) {
      columnComponents.push(<Column key={uuidv4()} index={i} />);
    }

    

    return (
      <div>
        <button onClick={() => setPage(1)}>Page 1に戻る</button>
        <div id="buttonsArea" className='flex'>
          <button onClick={() => {
            const newColumnNum = data.columnNum + 1;
            setData({ name: data.name, columnNum: newColumnNum });
            setValue('columnNum', data.columnNum);
          }}>カラム追加</button>
          <button onClick={() => {
            const newColumnNum = data.columnNum > 1 ? data.columnNum - 1 : data.columnNum;
            setData({ name: data.name, columnNum: newColumnNum });
            setValue('columnNum', data.columnNum);
          }}>カラム削除</button>
        </div>
        <p>テーブル名: {data.name}</p>
        <p>カラムの個数: {data.columnNum}</p>
        <form className="columns">{columnComponents}</form>
      </div>
    );
  }
};

const Column = ({ index }) => {
  return (
    <p>Column {index + 1}</p>
  );
}

export default CreateTable;
