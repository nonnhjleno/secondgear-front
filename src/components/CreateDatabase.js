import axios from 'axios';
import React from 'react'

// TODO: useFormを使って書き直す

const CreateDatabase = () => {
    const handleSubmit = event => {

        const formData = new FormData(event.target); // フォーム内のデータを取得
        const name = formData.get("name"); // "name"という名前の入力フィールドの値を取得
        console.log(name); // 入力フィールドの値をコンソールに出力
        axios.post(`http://localhost:3000/createDatabase?name=${name}`, {},{headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.error("APIでエラーが発生しました", error);
            });
    };

    return (
        <form onSubmit={event => handleSubmit(event)}>
            <label htmlFor="name">データベース名:
                <input
                    type="text"
                    id="name"
                    name="name"
                    className=' border-2'
                />
            </label>
            <input type="submit" defaultValue={"Submit"} />
        </form>
    );
}

export default CreateDatabase