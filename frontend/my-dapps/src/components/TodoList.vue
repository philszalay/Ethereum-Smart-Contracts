<template>
  <div>
    <h1>Todo List Dapp</h1>
    <div v-if="userAccount">
      <span>Using Account: {{userAccount}}</span>
      <form @submit.prevent="addTodo">
        <md-field>
          <label for="todoTitleInput">Todo Title</label>
          <md-input name="todoTitleInput" v-model="todoTitleInput" />
        </md-field>
        <md-button type="submit" class="md-raised md-primary" :disabled="todoTitleInput.length === 0">Add Todo</md-button>
      </form>
      <md-table md-card v-loadingSpinner="load.loadTodos">
        <md-table-toolbar>
        <md-button class="md-raised md-primary" @click="updateTodos()">Update Todos</md-button>
        <h1 class="md-title">Todos</h1>
        </md-table-toolbar>
        <md-table-row>
          <md-table-head>Id</md-table-head>
          <md-table-head>Title</md-table-head>
          <md-table-head>Done</md-table-head>
        </md-table-row>
        <md-table-row v-for="(todo, index) in todos" :key="index">
          <md-table-cell>
            {{ todo.id }}
          </md-table-cell>
          <md-table-cell>
            {{ todo.title }}
          </md-table-cell>
          <md-table-cell>
            <md-badge class="md-square" v-bind:class="{ 'green': todo.isDone }" :md-content="'' + todo.isDone" />
          </md-table-cell>
          <md-table-cell>
            <md-button v-if="!todo.isDone" class="md-raised" @click="markTodoAsDone(todo.id)">Mark as done</md-button>
            <span v-else></span>
          </md-table-cell>
        </md-table-row>
      </md-table>
    </div>
    <span v-else>Please connect this Site with MetaMask</span>
  </div>
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
      todos: [],
      load: {
        loadTodos: false
      }
    }
  },
  beforeCreate() {
    // Connect with MetaMask and set userAccount to first MetaMask account.
    window.ethereum.enable().then(() => {
      // Get contract instance from Blockchain.
      this.todoListInstance = new this.web3.eth.Contract(this.todoListAbi, this.todoListContractAddress);
      this.web3.eth.getAccounts().then(accounts => {
        this.userAccount = accounts[0];
        this.updateTodos();
      });
    });
  },
  methods: {
    updateTodos: function() {
      this.load.loadTodos = true;
      this.getAccountTodos().then(accountTodos => {
        this.todos = [];
        
        accountTodos.forEach((todo, index) => {
          if (todo.id !== "0" || index === 0) {
            this.todos.push({
              title: this.web3.utils.hexToAscii(todo.content),
              id: todo.id,
              isDone: todo.isDone
            });
          }
          
          this.load.loadTodos = false;
        });        
      });
    },
    getAccountTodos: async function() {
      try {
          return await this.todoListInstance.methods.getAccountTodos().call({
          from: this.userAccount
          });
      } catch(err) {
        // TODO: Handle error
        this.load.loadTodos = false;
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
    },
    markTodoAsDone: async function(id) {
      // TODO: Show loading spinner here

      try {
        await this.todoListInstance.methods.markTodoAsDone(id).send({
          from: this.userAccount
        });

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
  .green {
    background-color: green !important;
  }
</style>
