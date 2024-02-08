import React, { useState, ChangeEvent } from "react";
import styled from "styled-components";
import { nanoid } from "nanoid";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Button, Modal } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

// Stiller

const TodoContainer = styled.div`
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 5rem;
`;

const TodoTitle = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const TodoInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const TodoButton = styled.button`
  width: 100%;
  padding: 8px;
  color: white;
  border: none;
  border-radius: 4px;
  background-color: #198754;
`;

const TodoListUl = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
`;

const TodoListItem = styled.li`
  padding: 8px;
  margin-bottom: 4px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
`;
const ActionButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ActionButton = styled(Button)`
  margin-left: 5px;
`;

interface Todo {
  text: string;
  id: string;
}

// Bileşen
const TodoList: React.FC = () => {
  const [todoInput, setTodoInput] = useState<string>(""); // Input içeriği
  const [todos, setTodos] = useState<Todo[]>([]); // Alınacaklar listesi
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<Todo | null>(null);

  // Input değeri değiştiğinde çağrılır
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodoInput(e.target.value);
  };

  // Yeni bir hedef ekler
  const handleAddTodo = () => {
    if (todoInput.trim() !== "") {
      const newTodo: Todo = {
        text: todoInput,
        id: nanoid(),
      };
      setTodos([...todos, newTodo]);
      setTodoInput("");
    }
  };

  // Sürükle bırak sonrası listeyi günceller
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  };

  // Modalı aç
  const openModal = () => {
    setShowModal(true);
  };

  // Modalı kapat
  const closeModal = () => {
    setShowModal(false);
  };

  // Kaydet butonuna tıklandığında
  const handleSaveChanges = () => {
    if (!editedText) return;
    // Değişiklikleri uygula
    // Örneğin, belirli bir todo'nun metnini değiştir
    // Burada gerçek veritabanı güncellemesi gerçekleştirilebilir
    // Biz sadece örneğin bir todo'nun metnini değiştireceğiz
    const updatedTodos = todos.map((todo) => {
      if (todo.id === editedText.id) {
        return {
          ...todo,
          text: editedText.text,
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
    closeModal(); // Modalı kapat
  };

  // Silme işlemi
  const handleDelete = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <TodoContainer>
      <DragDropContext onDragEnd={onDragEnd}>
        <TodoTitle>Alınacaklar Listesi</TodoTitle>
        <div>
          <TodoInput
            type="text"
            value={todoInput}
            onChange={handleInputChange}
            placeholder="Hedefi yazın..."
          />
          <TodoButton onClick={handleAddTodo}>Ekle</TodoButton>
        </div>
        <Droppable droppableId="todos">
          {(provided) => (
            <TodoListUl ref={provided.innerRef} {...provided.droppableProps}>
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided) => (
                    <TodoListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {todo.text}
                      <ActionButtonsWrapper>
                        <Button
                          variant="success"
                          onClick={() => {
                            setEditedText(todo);
                            openModal();
                          }}
                        >
                          Düzenle
                        </Button>
                        <ActionButton
                          variant="danger"
                          onClick={() => handleDelete(todo.id)}
                        >
                          Sil
                        </ActionButton>
                      </ActionButtonsWrapper>
                    </TodoListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </TodoListUl>
          )}
        </Droppable>
      </DragDropContext>

      {/* Düzenleme Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Hedefi Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TodoInput
            type="text"
            value={editedText?.text || ""}
            onChange={(e) => editedText && setEditedText({ ...editedText, text: e.target.value })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Kaydet
          </Button>
        </Modal.Footer>
      </Modal>
    </TodoContainer>
  );
};

export default TodoList;
