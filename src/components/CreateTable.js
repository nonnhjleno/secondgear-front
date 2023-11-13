import React, { useContext, useState } from 'react';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { currentSelectedDatabaseContext } from '../App.js';

const CreateTable = () => {
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
        <MiddleForm setPage={setPage} columnNum={data.columnNum} changeNum={changeNum} />
      </>
    );

  }
};

const MiddleForm = ({ setPage, columnNum, changeNum }) => {
  const count = columnNum;

  let initialValue = [];

  for (let i = 0; i < count; i++) {
    initialValue = [...initialValue, { name: "", age: "" }];
  }

  const { control, handleSubmit } = useForm({
    defaultValues: {
      people: [...initialValue]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "people",
  });

  const [formCount, setFormCount] = useState(fields.length); // フォームの数を保存する状態変数

  const onSubmit = (data) => {
    console.log(data);
  };

  const addForm = () => {
    append({ name: "", age: "" });
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
              name={`people[${index}].name`}
              control={control}
              render={({ field }) => <input {...field} placeholder="名前" className="border-2 mx-2" />}
            />
            <Controller
              name={`people[${index}].age`}
              control={control}
              render={({ field }) => <input {...field} placeholder="年齢" className="border-2 mx-2" />}
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
