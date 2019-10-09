import React from "react";
import "../css/Todo.css"

class Todo extends React.Component {
	render() {
		const {todoName, is_done, checkBoxToggle, updateTodoQuestName, id, removeTodo} = this.props;
		var classNameCheckBox = 'castumCheckBox ';
		if(is_done === '1') classNameCheckBox += "checked ";

		return (
			<div className="todo">
				<div>
					<div className={classNameCheckBox} onClick={() => {checkBoxToggle(id)} } ></div>
					<span className="todoName" data-is_done={is_done} onClick={ () => {updateTodoQuestName(id)} }>{todoName}</span>
				</div>
				<span className="removeTodo" onClick={ () => { removeTodo(id) } } >X</span>
			</div>
		)
	}
}

export default Todo;