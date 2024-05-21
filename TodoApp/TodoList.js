import React, { useEffect, useState } from 'react';
import './TodoList.css';

const TodoList = () => {
    const [todos, setTodos] = useState([]); // Todoリストの状態を保持するuseState

    // get index of todo list from todo databases 
    useEffect(() => {
        fetch('http://localhost:8080/').then(res => {
            res.json().then(val => {
                setTodos(val);
            })
        })
            .catch(e => {
                console.error("failed reading a url" + e);
            })
    }, [])

    // put data from todo database into TodoData array, the key is a index for here
    const TodoData = todos && todos.map((item, index) => {
        return (<tr key={index} className='todo-item'>
            {/* <td>{item.id}</td> */}
            <td>{item.task}</td>
            {/* <td>{item.created_at}</td> */}
            <td>{item.deadline}</td>
            <td><button name='delete' onClick={() => deleteTodo(item)} className='delete-btn'>削除</button></td>
        </tr>);
    })

    // here is codes for add method 
    // I tried fetching by async await but failed

    // const add = (formData) => {
    //     async function fetchAsync() {

    //         const url = 'http://localhost:8080/add'
    //         const res = await fetch(url, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-type': 'application/json'
    //             },
    //             body: JSON.stringify(formData)
    //         });
    //         if (res.ok) {
    //             return fetchTodoData();
    //         } else {
    //             console.log("failed to add data");
    //         }
    //     }
    // }

    // normal fetch style
    const add = (formData) => {
        fetch('http://localhost:8080/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(res => {
                if (res.ok) {
                    return fetchTodoData();
                } else {
                    console.error('failed adding new tasks');
                }
            })
            .catch(e => {
                console.error("エラーです" + e)
            })
    }

    // here is codes for reloading todo data 
    const fetchTodoData = () => {
        fetch('http://localhost:8080/')
            .then(res => {
                res.json()
                    .then(val => {
                        setTodos(val);
                    })
            })
            .catch(e => {
                console.error("error occur" + e);
            })
    }

    // handle events 
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newStock = {
            task: formData.get('task'),
            deadline: formData.get('deadline'),
        };
        add(newStock);
    }

    // data delete 
    const deleteTodo = (item) => {
        fetch('http://localhost:8080/delete', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(item)
        })
            .then(res => {
                if (res.ok) {
                    console.log(item)
                    return fetchTodoData();
                } else {
                    console.error("failed to delete")
                }
            })
            .catch(e => {
                console.error("failed to fetch" + e)
            });
    }



    // here is HTML code 
    return (
        <div className='todo-app'>
            <h1>Todoアプリ</h1>
            <table className='todo-list'>
                <thead>
                    <h2>TODO一覧</h2>
                    <tr>
                        <th>タスク内容</th>
                        <th>期限</th>
                        <th>削除</th>
                    </tr>
                </thead>
                <tbody className='todo-item'>
                    {TodoData}
                </tbody>
            </table >
            <form onSubmit={handleSubmit} className='add-form'>
                <label>
                    タスク内容：
                    <input type='text' name='task' required />
                </label>
                <label>
                    締め切り：
                    <input type='datetime-local' name='deadline' placeholder='' min={"2024-05-21T00:00"} max={"2100-12-31T00:00"} required></input>
                </label>
                <button type='submit'>追加</button>
            </form>

        </div >
    );
}

export default TodoList;
