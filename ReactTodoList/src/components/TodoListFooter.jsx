import React from "react";
import "../css/TodoListFooter.css";

class TodoListFooter extends React.Component{
    render() {
        return(
            <div className="todoFooter">
                <span>total:  {this.props.allTodoLength} </span> 
                <span>finished: {this.props.finishTodoLength} </span> 
                <span>open: {this.props.openTodoLength} </span> 
            </div>
        )
    }
}

export default TodoListFooter;