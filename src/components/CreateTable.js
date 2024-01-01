import React, { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import styleForInput from './styleForInput';
import axios from 'axios';
import { currentSelectedDatabaseContext } from '../App';

const DynamicForm = ({ setCreateTableFlag }) => {

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

    for (let i = 0; i < formData.table.length; i++) {
      const element = formData.table[i];
      data[i] = { "column_name": element.column_name, "column_type": element.column_type.value };
    }

    const tableName = formData.table_name;

    const body = JSON.stringify({ data, tableName, currentSelectedDatabase });

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
          <DynamicFormField
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

const DynamicFormField = ({ index, formFields, deleteForm, control }) => {

  // const customStyles = {
  //   control: (provided, state) => ({
  //     ...provided,
  //     width: '8%',
  //     '&:hover': {
  //     },
  //   }),
  // }

  return (
    <div key={formFields[index].id} className='flex my-3'>
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
            options={[
              { "value": "TINYINT", "label": "TINYINT" },
              { "value": "SMALLINT", "label": "SMALLINT" },
              { "value": "MEDIUMINT", "label": "MEDIUMINT" },
              { "value": "INT", "label": "INT" },
              { "value": "BIGINT", "label": "BIGINT" },
              { "value": "FLOAT", "label": "FLOAT" },
              { "value": "DOUBLE", "label": "DOUBLE" },
              { "value": "DECIMAL", "label": "DECIMAL" },
              { "value": "NUMERIC", "label": "NUMERIC" },
              { "value": "BIT", "label": "BIT" },
              { "value": "DATE", "label": "DATE" },
              { "value": "TIME", "label": "TIME" },
              { "value": "DATETIME", "label": "DATETIME" },
              { "value": "TIMESTAMP", "label": "TIMESTAMP" },
              { "value": "YEAR", "label": "YEAR" },
              { "value": "VARCHAR(255)", "label": "VARCHAR(255)" },
              { "value": "CHAR(10)", "label": "CHAR(10)" },
              { "value": "BINARY", "label": "BINARY" },
              { "value": "VARBINARY", "label": "VARBINARY" },
              { "value": "BLOB", "label": "BLOB" },
              { "value": "TEXT", "label": "TEXT" },
              //Enum と Set はUIを考えてから 
            ]}
          />
        )}
      />
      <button type="button" onClick={() => deleteForm(formFields[index].id)}>
        削除
      </button>
    </div>
  );
};

export default DynamicForm;
