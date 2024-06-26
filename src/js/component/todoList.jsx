import React, { useState, useEffect } from "react";

const createUser = async (userName) => {
  try {
    const response = await fetch(
      `https://playground.4geeks.com/todo/users/${userName}`,
      {
        method: "POST",
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to create user");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

const deleteUser = async (userName) => {
  try {
    const response = await fetch(
      `https://playground.4geeks.com/todo/users/${userName}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      console.log("User deleted successfully");
      return true;
    } else {
      throw new Error("Failed to delete user");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};

const fetchAllUsers = async () => {
  try {
    const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`);
    if (response.ok) {
      const data = await response.json();
      return data.users; // Return only the array of users
    } else {
      throw new Error("Failed to fetch all users");
    }
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
};

const fetchUsersTasks = async (userName) => {
  try {
    const response = await fetch(
      `https://playground.4geeks.com/todo/users/${userName}`
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch tasks");
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

const addTask = async (userName, task) => {
  try {
    const response = await fetch(
      `https://playground.4geeks.com/todo/todos/${userName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to add task");
    }
  } catch (error) {
    console.error("Error adding task:", error);
    return null;
  }
};

const deleteTask = async (todoId) => {
  try {
    const response = await fetch(
      `https://playground.4geeks.com/todo/todos/${todoId}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      return true;
    } else {
      throw new Error("Failed to delete task");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
};

const updateTask = async (todoId, updatedTask) => {
  try {
    const response = await fetch(
      `https://playground.4geeks.com/todo/todos/${todoId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to update task");
    }
  } catch (error) {
    console.error("Error updating task:", error);
    return null;
  }
};

const TodoList = () => {
  const [username, setUsername] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [isUserCreated, setIsUserCreated] = useState(false);

  const baseApiUrl = "https://playground.4geeks.com/todo";

  const fetchUserAndTodos = async (username) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/users/${username}`);
      if (response.ok) {
        const userData = await response.json();
        return userData;
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const fetchTodos = async () => {
    if (username !== "") {
      try {
        const userData = await fetchUserAndTodos(username);
        if (userData !== null) {
          setTodoList(userData.todos || []);
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }
  };

  const deleteUser = () => {
    if (username !== "") {
      fetch(`${baseApiUrl}/users/${username}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.text().then((text) =>
              text ? JSON.parse(text) : {}
            );
          }
          throw Error(response.statusText + "! Something went wrong");
        })
        .then(() => {
          setUsername("");
          setTodoList([]);
          setIsUserCreated(false);
          alert("User and tasks are deleted now");
        })
        .catch((err) => {
          console.log("Error", err);
        });
    } else {
      alert("We cannot delete empty user");
    }
  };

  const createUser = async () => {
    if (username !== "") {
      console.log(username);
      try {
        const response = await fetch(`${baseApiUrl}/users/${username}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // If user already exists, fetch their todos
          if (response.status === 400) {
            alert("User already exists, fetching todos...");
            setIsUserCreated(true);
            fetchTodos(username);
          } else {
            throw new Error(
              response.statusText + "! Something went wrong"
            );
          }
        } else {
          await response.json();
          alert("User created successfully");
          setIsUserCreated(true);
          fetchTodos(username); // Fetch todos after user is created
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Error: Username cannot be empty");
      throw new Error("Username cannot be empty");
    }
  };

  const addNewTodo = () => {
    if (username === "") {
      alert("Please add Username First");
      return;
    }

    if (newTodo !== "") {
      fetch(`${baseApiUrl}/todos/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: newTodo,
          is_done: false,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setTodoList([...todoList, data]);
          console.log("Task added: ", data);
          setNewTodo("");
        })
        .catch((error) => console.error("Error:", error));
    } else {
      alert("Todo cannot be empty");
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${baseApiUrl}/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(response.statusText + "! Something went wrong");
      }

      if (response.headers.get("content-length") !== "0") {
        const data = await response.json();
        console.log(data);
      }

      const updatedTodoList = todoList.filter((todo) => todo.id !== id);
      setTodoList(updatedTodoList);

      const putResponse = await fetch(`${baseApiUrl}/todos`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodoList),
      });

      if (!putResponse.ok) {
        throw new Error(putResponse.statusText + "! Something went wrong");
      }

      alert("Todo deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleTodoCheck = (id) => {
    console.log("Checkbox clicked, id:", id);

    const updatedTodoList = todoList.map((todo) => {
      if (todo.id === id) {
        console.log("Todo found, updating is_done");
        return { ...todo, is_done: !todo.is_done };
      }
      return todo;
    });

    console.log("Updated todo list:", updatedTodoList);

    return fetch(`${baseApiUrl}/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: updatedTodoList.find((todo) => todo.id === id).label,
        is_done: updatedTodoList.find((todo) => todo.id === id).is_done,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Fetch request successful");
          return response.json();
        }
        throw Error(response.status + "! Something Went Wrong");
      })
      .then(() => {
        console.log("Updating state with updated todo list");
        setTodoList(updatedTodoList);
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  const createTodo = (todoData) => {
    console.log(todoData);
    return fetch(`${baseApiUrl}/todos/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoData),
    })
      .then((response) => {
        if (response.ok) {
          return response.text().then((text) => (text ? JSON.parse(text) : {}));
        }
        throw Error(response.statusText + "! Something went wrong");
      })
      .then(() => {
        alert("Todo task created successfully");
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  useEffect(() => {
    if (isUserCreated) {
      fetchTodos();
    }
  }, [isUserCreated, username]);

  return (
    <div className="todo-app">
      <div className="input-section">
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your Username"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createUser();
            }
          }}
        />
        <button className="button" onClick={deleteUser}>
          Delete User
        </button>
      </div>

      {isUserCreated && (
        <div className="input-section">
          <input
            className="input"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter your New Task"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addNewTodo();
              }
            }}
          />
          <button className="button" onClick={addNewTodo}>
            Add
          </button>
        </div>
      )}

      <ul className="todo-list">
        {todoList !== undefined &&
          todoList.map((todo) => (
            <li key={todo.id} className="todo-item">
              <input
                type="checkbox"
                className="checkbox"
                checked={todo.is_done}
                onChange={() => handleTodoCheck(todo.id)}
              />
              {todo.label}
              <i
                className="fa fa-trash delete-icon"
                aria-hidden="true"
                onClick={() => deleteTodo(todo.id)}
              ></i>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TodoList;
