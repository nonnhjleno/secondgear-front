import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form';

const CreateDatabase = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        criteriaMode: 'all',
    });

    const handleOnError = errors => console.log(errors);

    const handleOnSubmit = async formData => {
        try {
            const response = await axios.post(
                `http://localhost:3000/createDatabase`,
                formData,
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }
            );

            console.log(response);
            window.location.reload();
        } catch (error) {
            console.error("APIでエラーが発生しました", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleOnSubmit, handleOnError)}>
            <label htmlFor="name">データベース名: </label>
            <input
                {...register('name', {
                    required: 'データベース名を入力してください',
                })}
                id='databaseName'
                type="text"
                className="border-2 border-black rounded"
            />
            {errors.name && <p className="text-red-600">{errors.name.message}</p>}
            <button type="submit" className="border-2 border-black rounded">
                決定
            </button>
        </form>

    );
}

export default CreateDatabase