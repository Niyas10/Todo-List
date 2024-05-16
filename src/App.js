import "./App.css";
import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditItem] = useState({
    title: "",
    description: "",
  });

  const handleAddTodo = () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      alert("Please fill in both title and description.");
      return;
    }

    const isDuplicate = allTodos.some(
      (todo) =>
        todo.title.trim().toLowerCase() === newTitle.trim().toLowerCase() &&
        todo.description.trim().toLowerCase() === newDescription.trim().toLowerCase()
    );
  
    if (isDuplicate) {
      alert("This todo already exists.");
      return;
    }
  
    const newTodoItem = {
      title: newTitle,
      description: newDescription,
    };
  
    const updatedTodoArr = [...allTodos, newTodoItem];
    setTodos(updatedTodoArr);
    localStorage.setItem("todolist", JSON.stringify(updatedTodoArr));
    setNewTitle("");
    setNewDescription("");
  };

  const handleDeleteTodo = (index) => {
    const reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1);
    localStorage.setItem("todolist", JSON.stringify(reducedTodo));
    setTodos(reducedTodo);
  };

  const handleComplete = (index) => {
    const now = new Date();
    const completedOn = `${now.getDate()}-${
      now.getMonth() + 1
    }-${now.getFullYear()} at ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    const filteredItem = {
      ...allTodos[index],
      completedOn: completedOn,
    };

    const updatedCompletedArr = [...completedTodos, filteredItem];
    setCompletedTodos(updatedCompletedArr);
    handleDeleteTodo(index);
    localStorage.setItem("completedTodos", JSON.stringify(updatedCompletedArr));
  };

  const handleDeleteCompletedTodo = (index) => {
    const reducedTodo = [...completedTodos];
    reducedTodo.splice(index, 1);
    localStorage.setItem("completedTodos", JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  };

  useEffect(() => {
    const savedTodo = localStorage.getItem("todolist");
    const savedCompletedTodo = localStorage.getItem("completedTodos");

    if (savedTodo) {
      try {
        setTodos(JSON.parse(savedTodo));
      } catch (error) {
        console.error("Error parsing savedTodo:", error);
      }
    }

    if (savedCompletedTodo) {
      try {
        setCompletedTodos(JSON.parse(savedCompletedTodo));
      } catch (error) {
        console.error("Error parsing savedCompletedTodo:", error);
      }
    }
  }, []);

  const handleEdit = (ind, item) => {
    setCurrentEdit(ind);
    setCurrentEditItem(item);
  };

  const handleUpdateTitle = (value) => {
    setCurrentEditItem((prev) => ({ ...prev, title: value }));
  };

  const handleUpdateDescription = (value) => {
    setCurrentEditItem((prev) => ({ ...prev, description: value }));
  };

  const handleUpdateTodo = () => {
    if (
      !currentEditedItem.title.trim() ||
      !currentEditedItem.description.trim()
    ) {
      alert("Please fill in both title and description.");
      return;
    }

    const newTodo = [...allTodos];
    newTodo[currentEdit] = currentEditedItem;
    setTodos(newTodo);
    setCurrentEdit("");
  };

  return (
    <div className="App">
      <div className="todo-wrapper" >
        <h1 >
          <span  style={{ color: "white" }}>   My </span> <span style={{ color: "red" }}>Todo</span>
        </h1>
        <div className="todo-input">
          <div className="todo-input-item">
            <label> Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the task...!"
              style={{ color:"white" }}
            />
          </div>

          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What's the Descriptions..!"   style={{ color:"white" }}
            />
          </div>

          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-3">
            <div className="btn-area">
              <div>
                <button
                  className={`secondary-btn ${!isCompleteScreen && "active"}`}
                  onClick={() => setIsCompleteScreen(false)}
                >
                  Todo
                </button>
              </div>
              <div>
                <button
                  className={`secondary-btn-1 ${isCompleteScreen && "active"}`}
                  onClick={() => setIsCompleteScreen(true)}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="todo-list">
              {isCompleteScreen === false &&
                allTodos.map((item, index) => {
                  if (currentEdit === index) {
                    return (
                      <div className="edit_wrapper" key={index}>
                        <input    className="update-input-first"
                          placeholder="Updated title"
                          onChange={(e) => handleUpdateTitle(e.target.value)}
                          value={currentEditedItem.title}  
                        />

                        <textarea className="update-input-second"
                          placeholder="Updated description"
                          onChange={(e) =>
                            handleUpdateDescription(e.target.value)
                          }
                          value={currentEditedItem.description}
                        />

                        <button
                          type="button"
                          onClick={handleUpdateTodo}
                          className="primaryBtn-update"
                        >
                          Update
                        </button>
                      </div>
                    );
                  } else {
                    return (
                      <div className="todo-list-item" key={index} >
                        <div>
                          <h2>{item.title}</h2>
                          <p>{item.description}</p>
                        </div>

                        <div style={{display:'flex',alignItems:"center"}}>
                          <MdDelete onClick={() => handleDeleteTodo(index)}  style={{marginRight:'12px',fontSize:'20px'}}   className="icon-set1"    />
                          <FaCheck onClick={() => handleComplete(index)}     style={{marginRight:'12px',fontSize:'20px'}}   className="icon-set2" />
                          <FaRegEdit onClick={() => handleEdit(index, item)}     style={{fontSize:'20px'}}   className="icon-set3" />
                        </div>
                      </div>
                    );
                  }
                })}

              {isCompleteScreen === true &&
                completedTodos.map((item, index) => (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h2>{item.title}</h2>
                      <p>{item.description}</p>
                      <p>
                        <small>Completed on:</small> {item.completedOn}
                      </p>
                    </div>

                    <div>
                      <MdDelete
                        onClick={() => handleDeleteCompletedTodo(index)}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
