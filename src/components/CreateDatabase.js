import React from 'react'

// TODO: useFormを使って書き直す

const CreateDatabase = () => {
    const handleSubmit = event => {

        const formData = new FormData(event.target);
        const name = formData.get("name");
        console.log(name);

        fetch('http://localhost:3000/createDatabase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `name=${name}`
        })
            .then(response => response.json())
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