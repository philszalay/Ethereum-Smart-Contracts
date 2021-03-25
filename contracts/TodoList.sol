// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.3;

import "./Owned.sol";

contract ToDoList is Owned {
    uint256 public constant maxAmountOfTodosForUser = 100;
    
    Todo[] internal allTodos;

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

    function getAllTodos() view public onlyOwner() returns(Todo[] memory) {
        return allTodos;
    }

    function getAccountTodos() view public returns(Todo[maxAmountOfTodosForUser] memory) {
        return todos[msg.sender];
    }

    function addTodo(bytes32 _content) public {
        Todo memory newTodo = Todo(lastIds[msg.sender], _content, block.timestamp, msg.sender, false);
        todos[msg.sender][lastIds[msg.sender]] = newTodo;
        allTodos.push(newTodo);
    }
    
    function markTodoAsDone(uint256 _id) public {
        require(todos[msg.sender][_id].owner == msg.sender);
        require(_id <= maxAmountOfTodosForUser);
        require(!todos[msg.sender][_id].isDone);
        
        todos[msg.sender][_id].isDone = true;
    }
}
