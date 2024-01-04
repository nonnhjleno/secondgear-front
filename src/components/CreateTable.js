import React, { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import styleForInput from './styleForInput';
import axios from 'axios';
import { currentSelectedDatabaseContext } from '../App';
import typeChoices from './typeChoices';

const CreateTable = ({ setCreateTableFlag }) => {

  const currentSelectedDatabase = useContext(currentSelectedDatabaseContext);

  const { control, handleSubmit } = useForm({
    defaultValues: { table: [{ column_name: '', column_type: '' }] },
  });

  const [formFields, setFormFields] = useState([{ id: uuidv4() }]);

  const addForm = () => {
    setFormFields([...formFields, { id: uuidv4() }]);
  };

  const deleteForm = (id) => {
    setFormFields(formFields.filter((field) => field.id !== id));
  };

  const onSubmit = formData => {
    let data = {};
    console.log(formData);
    for (let i = 0; i < formData.table.length; i++) {
      const element = formData.table[i];
      const not_null = element.not_null === undefined ? 'false':'true';
      data[i] = { "column_name": element.column_name, "column_type": element.column_type.value, 'not_null':not_null };
    }

    const tableName = formData.table_name;

    const body = JSON.stringify({ data, tableName, currentSelectedDatabase });

    console.log(data);

    axios.post(`http://localhost:3000/createTable`, body, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      .then(response => {
        console.log(response);
        setCreateTableFlag(true);
      });

  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} >
      <Controller
        name={`table_name`}
        control={control}
        render={({ field }) => <input {...field} placeholder="TableName" className="border-2 mx-2 w-1/12" />}
      />
      {
        formFields.map((field, index) => (
          <CreateTableField
            key={field.id}
            index={index}
            formFields={formFields}
            setFormFields={setFormFields}
            deleteForm={deleteForm}
            control={control}
          />
        ))
      }
      < button type="button" onClick={addForm} >
        新しいセットを追加
      </button >
      <button type="submit">Submit</button>
    </form >
  );
};

const CreateTableField = ({ index, formFields, deleteForm, control }) => {

  // const customStyles = {
  //   control: (provided, state) => ({
  //     ...provided,
  //     width: '8%',
  //     '&:hover': {
  //     },
  //   }),
  // }

  return (
    <div key={formFields[index].id} className={`flex p-3 ${index % 2 === 0 ? 'bg-slate-300' : ''}`}>
      <button type="button" onClick={() => deleteForm(formFields[index].id)}>
        削除
      </button>
      <Controller
        name={`table[${index}].column_name`}
        control={control}
        render={({ field }) => <input {...field} placeholder="column_name" className={`${styleForInput}`} />}
      />
      <Controller
        name={`table[${index}].column_type`}
        control={control}
        render={({ field }) => (
          <Select
            className={` ${styleForInput}`}
            // styles={customStyles}
            {...field}
            options={typeChoices}
          />
        )}
      />
      <Controller
        name={`table[${index}].not_null`}
        control={control}
        render={({ field }) => <input type='checkbox' {...field} placeholder="NOT NULL" className=' w-8' />}
      />

    </div>
  );
};

export default CreateTable;
