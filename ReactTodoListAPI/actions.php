<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Content-Type: application/json");

require_once './config/config.php';
require_once './classes/Todo.php';

$todo = new Todo();
$json = "";

//RESTFUL API FOR HENDELING THE REQUESTS
switch ($_SERVER['REQUEST_METHOD']) {
    case "GET":
        $json = $todo->getTodos($_GET); 
    break;


    case "POST":
		$request = file_get_contents("php://input");
		$request = json_decode($request);
        $json = $todo->addTodo($request);
    break;


    case "PUT":
        $request = file_get_contents("php://input");
        $request = json_decode($request);
        $json = $todo->updateTodo($request);
    break;


    case "DELETE":
        $request = file_get_contents("php://input");
        $request = json_decode($request);
        $json = $todo->deleteTodo($request);
    break;
}
echo json_encode($json);