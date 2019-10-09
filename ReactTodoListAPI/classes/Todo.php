<?php
Class Todo {
    private $con;
    private $lastError;
    // make connection to db
    function __construct() {
        try {
            //const from config file
            $this->con = new PDO("mysql:host=" . HOST . ";dbname=" . DB . "", USER, PASS);
        }
        catch(PDOException $e)
        {
            echo "Connection failed: " . $e->getMessage(); die();
        }
    }
    
    public function getTodos($get) { 
        $sql = "SELECT * FROM `todos`";
        try{
            $message = new stdClass();
            $message->status = true;
            $stms = $this->con->prepare($sql);
            $stms->execute();
            $data = $stms->fetchAll(PDO::FETCH_OBJ);
            $message->data = $data;
            return $message;
        }
        catch (PDOException $e){
            $this->lastError = $e->getMessage();
            return errorMessage();
        }
    }
    
    public function addTodo($todo) {
         //incase missing params
        if( !isset($todo->name) ){ 
            $this->lastError = "Missing name parameter";
            return $this->errorMessage();
        }
        
        $message = new stdClass();
        $params = array(':name' => $todo->name);
        $sql = "INSERT INTO todos 
                SET name = :name,
                is_done = '0',
                created_at = NOW(),
                updated_at = NOW()
                ";
        try{
            $stms = $this->con->prepare($sql);
            $stms->execute($params);
            $id = $this->con->lastInsertId();
            $data = $this->getTodoByID(['id' => $id]); // fetching new user data
            $message->status = true;
            $message->data = $data;
            return $message;
        }
        catch(PDOException $e){
            $this->lastError = $e->getMessage();
            return $this->errorMessage();
        }
    }
    
    public function updateTodo($request) {
        if( !isset($request->id) || !isset($request->is_done) || !isset($request->name) ){ 
            $this->lastError = "Missing put request parameters: " . json_encode($request);
            return $this->errorMessage();
        }
        
        $message = new stdClass();
        $params = [
            ":is_done" => $request->is_done,
            ":id" => $request->id,
            ":name" => $request->name
        ];
        $sql = "UPDATE todos SET is_done = :is_done, name = :name, updated_at = NOW() WHERE id = :id";
        
        try{
            $stms = $this->con->prepare($sql);
            $stms->execute($params);
            $data = $this->getTodoByID(['id' => $request->id]); // fetching new user data
            $message->status = true;
            $message->data = $data;
            return $message;
        }
        catch(PDOException $e){
            $this->lastError = $e->getMessage();
            return $this->errorMessage();
        }
    }
    
    public function deleteTodo($request) {
        if( !isset($request->id) ){ 
            $this->lastError = "Missing id parameter";
            return $this->errorMessage();
        }

        $message = new stdClass();
        $params = array("id" => $request->id);
        $sql = "DELETE FROM todos WHERE id = :id";
        try{
            $data = $this->getTodoByID(['id' => $request->id]); // fetching new user data
            $stms = $this->con->prepare($sql);
            $stms->execute($params);
            $message->status = true;
            $message->data = $data;
            return $message;
        }
        catch(PDOException $e){
            $this->lastError = $e->getMessage();
            return $this->errorMessage();
        }
    }
    
    private function getTodoByID($get) {
        //incase missing params
        if( !isset($get['id']) ){ 
            $this->lastError = "Missing id parameter";
            return $this->errorMessage();
        }
        
        $message = new stdClass();
        $params = array(':id' => $get['id']);
        $sql = "SELECT * FROM `todos` WHERE id = :id";
        try{
            $stms = $this->con->prepare($sql);
            $stms->execute($params);
            return $stms->fetchAll(PDO::FETCH_OBJ);
        }
        catch (PDOException $e){
            $this->lastError = $e->getMessage();
            return $this->errorMessage();
        }
    }
    
    private function errorMessage() {
       $message = new stdClass();
       $message->status = false;
       $message->errorMessage = $this->lastError;
       return $message;
    }
}
