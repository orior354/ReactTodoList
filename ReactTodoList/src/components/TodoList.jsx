import React from 'react';
import TodoListHeader from "./TodoListHeader";
import Todo from './Todo';
import TodoListFooter from "./TodoListFooter";
import Swal from 'sweetalert2'
import "../css/TodoList.css";

class TodoList extends React.Component {
 	url = "http://localhost:8181/react-todo-list-project/ReactTodoListAPI/actions.php";
	state = {
		loading: true,
		todos: null
	}
	
	render() {
		
		return (
			<div className="todo-list-container" >
				<TodoListHeader 
				addTodo={this.addTodo}
				/>
				<div className="list">
					{
						(! this.state.loading || this.state.todos ) ? 
							(
							this.state.todos.map( (todo, key) => {
								return (
										<Todo 
										todoName={todo.name} 
										is_done={todo.is_done} 
										id={todo.id} 
										checkBoxToggle={this.checkBoxToggle}
										updateTodoQuestName={this.updateTodoQuestName}
										removeTodo={this.removeTodo}
										key={todo.id}
										/>
								)
							})
						) : (
							<span>Loading data...</span>
						)
					}
				</div>
				<TodoListFooter 
				allTodoLength={(this.state.todos) ? this.state.todos.length : 0}
				finishTodoLength={this.getFinishTasks("1").length}
				openTodoLength={this.getFinishTasks("0").length} 
				/>
				
			</div>
		)
	}
	
	async componentDidMount(){
		let responce = await fetch(this.url);
		let data = await responce.json();
		if(data.status === true){
			this.setState({todos: data['data'], loading: false})
		}
	}

	removeTodo = (id) => {
		fetch(this.url, {
			method: 'DELETE',
			body: JSON.stringify({
				id: id
			})
		})
		.then(responce => {
			return responce.json();
		})
		.then(responce => {
			console.log()
			if(responce.status === true){
				this.setState(prevState => {
					return {
						todos: this.state.todos.filter(todo => todo.id !== id)
					}
				});
			}
		})
	}

	getFinishTasks = (status) => {
		if(!this.state.todos || this.state.loading){
			return [];
		}
		return	this.state.todos.filter( todo => todo.is_done === status);
	}

	addTodo = () => {
		Swal.fire({
			title: 'Add todo',
			input: 'text',
			inputAttributes: {
			  autocapitalize: 'off'
			},
			showCancelButton: true,
		})
		.then(responce => {
			if(responce.value){
			fetch(this.url, {
				method: 'POST',
				body: JSON.stringify({
					name: responce.value
				})
			})
			.then(responce => {
				return responce.json();
			})
			.then(responce => {
				console.log('addingTodo: ', responce)
				if(responce.status === true){
					let newState = this.state;
					newState.todos.push(responce.data[0])
					this.setState(newState);
				}
			})
			}
		})
		
	}

	//Todo: check if can do better
	checkBoxToggle = (id) => {
		let newState = this.state;
	 	newState.todos.map( prevTodo => {
			if(prevTodo.id !== id){
				return prevTodo
			}

			let is_done = prevTodo.is_done === '1' ? '0' : '1';
			fetch(this.url, {
				method: 'PUT',
				body: JSON.stringify({
					id: id,
					is_done: is_done,
					name: prevTodo.name
				})
			})
			.then(responce => {
				return responce.json();
			})
			.then(responce => {
				if(responce.status === true && responce.data[0].is_done === is_done){
					prevTodo.is_done = is_done;
					return prevTodo;
				}
				else{
					console.error('fail to update is_done in database', responce);
					return prevTodo;
				}
			})
			.then( prevTodo => {
				this.setState(newState)
			})
			return newState;
		})
	}


	updateTodoQuestName = (id) => {
		let oldState = this.state;
		let chengedTodo = oldState.todos.filter(todo => todo.id === id)[0]
		Swal.fire({
			title: 'update youre todo name',
			input: 'text',
			inputAttributes: {
			  autocapitalize: 'off'
			},
			showCancelButton: true,
		  })
		  .then((result) => {
			if (result.value) {
				fetch(this.url, {
					method: 'PUT',
					body: JSON.stringify({
						id: id,
						is_done: chengedTodo.is_done,
						name: result.value
					})
				})
				this.setState( () => {
					return oldState.todos.map(todo => {
						if(todo.id !== id) return todo
						todo.name = result.value;
						return todo;
					})
				})
				

				// this.setState(prevState => {
				// 	return {
				// 		todos: prevState.todos.map( prevTodo => {
				// 			if(prevTodo.id !== id){
				// 				return prevTodo
				// 			}
				// 			prevTodo.questName = result.value;

				// 			return prevTodo;
				// 		})
				// 	}
				// });
			}
		  })
		this.setState()
	}
}

export default TodoList;