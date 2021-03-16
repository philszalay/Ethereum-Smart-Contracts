// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.5.16;

contract ToDoList {
    uint256 public constant maxAmountOfTodosForUser = 100;

    // owner => array of Todos
    mapping(address => Todo[maxAmountOfTodosForUser]) public todos;
    
    // owner => id of last Todo
    mapping(address => uint256) public lastIds;

    struct Todo {
        uint256 id;
        bytes32 content;
        uint256 creationDate;
        address owner;
        bool isDone;
    }
    
    modifier onlyOwner(address _owner) {
        require(msg.sender == _owner);
        _;
    }

    function addTodo(bytes32 _content) public {
        Todo memory newTodo = Todo(lastIds[msg.sender], _content, block.timestamp, msg.sender, false);
        todos[msg.sender][lastIds[msg.sender]] = newTodo;
    }
    
    // A modifier can be added to a function and gets executed first. It handles the access to the function.
    function markTodoAsDone(uint256 _id) public onlyOwner(todos[msg.sender][_id].owner) {
        require(_id <= maxAmountOfTodosForUser);
        require(!todos[msg.sender][_id].isDone);
        
        todos[msg.sender][_id].isDone = true;
    }
}
