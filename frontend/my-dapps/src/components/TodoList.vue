<template>
  <div v-if="userAccount">
    <h1>Using Account:</h1>
    <span>{{userAccount}}</span>
    <form @submit.prevent="addTodo">
      <input v-model="todoTitleInput" placeholder="Todo title">
      <button type="submit" :disabled="todoTitleInput.length === 0">Add Todo</button>
    </form>
      <button @click="updateTodos()">Update Todos</button>
  </div>
  <span v-else>Please connect this Site with MetaMask</span>
</template>

<script>
import Web3 from 'web3';

export default {
  name: 'TodoList',
  data() {
    return {
      todoListContractAddress: '0xaebdbd7a9A884e6B9040c68B61e00b2907Dacd26',
      web3: new Web3(Web3.givenProvider || new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/0ea14456f513454ea520fd84dc9083a9')),
      todoListAbi: [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "lastIds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "maxAmountOfTodosForUser",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "todos",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "content",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "creationDate",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "isDone",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getAllTodos",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "content",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "creationDate",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "isDone",
              "type": "bool"
            }
          ],
          "internalType": "struct ToDoList.Todo[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getAccountTodos",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "content",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "creationDate",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "isDone",
              "type": "bool"
            }
          ],
          "internalType": "struct ToDoList.Todo[100]",
          "name": "",
          "type": "tuple[100]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_content",
          "type": "bytes32"
        }
      ],
      "name": "addTodo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "markTodoAsDone",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
      ],
      todoListInstance: null,
      userAccount: null,
      todoTitleInput: '',
      todos: []
    }
  },
  beforeCreate() {
    // Connect with MetaMask and set userAccount to first MetaMask account.
    window.ethereum.enable().then(() => {
      // Get contract instance from Blockchain.
      this.todoListInstance = new this.web3.eth.Contract(this.todoListAbi, this.todoListContractAddress);
      this.web3.eth.getAccounts().then(accounts => {
        this.userAccount = accounts[0];
      });
    });
  },
  methods: {
    updateTodos: function() {
      this.getAccountTodos().then(accountTodos => {
        this.todos = [];
        
        accountTodos.forEach(todo => {
          this.todos.push(this.web3.utils.hexToAscii(todo.content));
        });
        
        console.log(this.todos);  
      });
    },
    getAccountTodos: async function() {
      try {
          return await this.todoListInstance.methods.getAccountTodos().call({
          from: this.userAccount
          });
      } catch(err) {
        // TODO: Handle error
      }
    },
    addTodo: async function() {
      // TODO: Show loading spinner here

      if(this.todoTitleInput.length <= 0) {
        console.log('Todo title missing in function addTodo');
        return;
      }
      
      try {
        await this.todoListInstance.methods.addTodo(this.web3.utils.asciiToHex(this.todoTitleInput)).send({
          from: this.userAccount
        });

        this.todoTitleInput = '';
        this.updateTodos();

        // TODO: Hide loading spinner here
      } catch(err) {
        // TODO: Handle error
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
