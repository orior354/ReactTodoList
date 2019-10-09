import React from "react";
import TodoAddBtn from "./TodoAddBtn";
import "../css/TodoListHeader.css";

class TodoListHeader extends React.Component {
    render() {
        const {addTodo} = this.props
        return(
        <div className='todo-header'>
            <span>Todos</span>
            <TodoAddBtn addTodo={addTodo}/>
        </div>
        
        )
    }
}

export default TodoListHeader