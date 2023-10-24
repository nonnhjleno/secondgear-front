import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { currentSelectedDatabaseContext } from '../App.js';

const CreateTable = () => {
  const currentSelectedDatabase = useContext(currentSelectedDatabaseContext);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ name: '', columnNum: 0 });

  const {
    register,
    handleSubmit,
    formState: { errors },
    // getValues,
  } = useForm({
    criteriaMode: 'all',
    defaultValues: {
      name: '',
      columnNum: 3,
    },
  });

  const handleOnSubmit = formData => {
    console.log(formData.name, formData.columnNum);
    setData(formData);
    setPage(2);
  };

  const handleOnError = errors => console.log(errors);

  if (page === 1) {
    return (
      <form onSubmit={handleSubmit(handleOnSubmit, handleOnError)}>
        <h1>{currentSelectedDatabase}</h1>
        <div>
          <label htmlFor="name">テーブル名: </label>
          <input
            {...register('name', {
              required: 'テーブル前を入力してください',
            })}
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
    return (
      <div>
        <button onClick={() => setPage(1)}>Page 1に戻る</button>
        <p>テーブル名: {data.name}</p>
        <p>カラムの個数: {data.columnNum}</p>
      </div>
    );
  }
};

export default CreateTable;
