import React from "react";
import "../css/TodoAddBtn.css"

class TodoAddBtn extends React.Component{
    render () {
        const {addTodo} = this.props;
        return (
            <div className="addTodoBtn" onClick={ () => { addTodo() } }>
                <span>+</span>
            </div>
        );
    }
}

export default TodoAddBtn;