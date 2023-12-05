import React, { useContext, useState } from 'react';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { currentSelectedDatabaseContext } from '../App.js';

const CreateTable = ({ setCreateTableFlag }) => {
  const currentSelectedDatabase = useContext(currentSelectedDatabaseContext);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ name: '', columnNum: 3 });

  const {
    register,
    handleSubmit,
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
          決定
        </button>
      </form>
    );
  } else if (page === 2) {

    const changeNum = (num) => {
      setData({ name: data.name, columnNum: num });
      setValue('columnNum', num);
    };

    return (
      <>
        <MiddleForm tableName={data.name} setPage={setPage} columnNum={data.columnNum} changeNum={changeNum} setCreateTableFlag={setCreateTableFlag} />
      </>
    );

  }
};

const MiddleForm = ({ setPage, columnNum, changeNum, tableName, setCreateTableFlag }) => {
  const currentSelectedDatabase = useContext(currentSelectedDatabaseContext);
  const count = columnNum;

  let initialValue = [];

  for (let i = 0; i < count; i++) {
    initialValue = [...initialValue, { column_name: "", column_type: "" }];
  }

  const { control, handleSubmit } = useForm({
    defaultValues: {
      table: [...initialValue]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "table",
  });

  const [formCount, setFormCount] = useState(fields.length); // フォームの数を保存する状態変数

  const onSubmit = formData => {
    console.log(tableName);
    let data = {};

    for (let i = 0; i < formData.table.length; i++) {
      const element = formData.table[i];
      data[i] = { "column_name": element.column_name, "column_type": element.column_type };
    }

    fetch('http://localhost:3000/createTable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({ data, tableName, currentSelectedDatabase })
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setCreateTableFlag(true);
      })
      .catch(error => {
        console.error("APIでエラーが発生しました", error);
      });

  };

  const addForm = () => {
    append({ column_name: "", column_type: "" });
    setFormCount(formCount + 1); // フォームを追加したらフォームの数を更新
  };

  const deleteForm = (index) => {
    remove(index);
    setFormCount(formCount - 1); // フォームを削除したらフォームの数を更新
  };

  return (
    <div className="border-black">
      <button onClick={() => {
        setPage(1);
        changeNum(formCount);
      }}>Page 1に戻る</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <button className="border-2" type="button" onClick={addForm}>
          追加
        </button>
        {fields.map((item, index) => (
          <div key={uuidv4()}>
            <Controller
              name={`table[${index}].column_name`}
              control={control}
              render={({ field }) => <input {...field} placeholder="column_name" className="border-2 mx-2" />}
            />
            <Controller
              name={`table[${index}].column_type`}
              control={control}
              render={({ field }) => <input {...field} placeholder="column_type" className="border-2 mx-2" />}
            />
            <button type="button" onClick={() => deleteForm(index)}>
              削除
            </button>
          </div>
        ))}
        <button type="submit">送信</button>
      </form>
      <p>フォームの数: {formCount}</p>
    </div>
  );

}

export default CreateTable;
