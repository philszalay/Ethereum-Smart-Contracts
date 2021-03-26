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
        <v-btn type="submit" :disabled="todoTitleInput.length === 0">Add Todo</v-btn>
      </form>
      <v-simple-table dark>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Id</th>
              <th class="text-left">Title</th>
              <th class="text-left">Done</th>
              <th class="text-right"><v-btn icon color="green" @click="updateTodos()"><v-icon>mdi-cached</v-icon></v-btn></th>
            </tr>
          </thead>
          <tbody v-loading="load.loadTodos">
            <tr v-for="(todo, index) in todos" :key="index">
              <td>{{ todo.id }}</td>
              <td>{{ todo.title }}</td>
              <td><v-chip :color="todo.isDone ? 'green' : 'red'" label>{{ todo.isDone }}</v-chip></td>
              <td class="text-right" v-if="!todo.isDone" @click="!load.loadMarkAsDoneButton[todo.id] ? markTodoAsDone(todo.id) : null"><v-btn color="primary" :loading="load.loadMarkAsDoneButton[todo.id]"  :disabled="load.loadMarkAsDoneButton[todo.id]">Mark as done</v-btn></td>
              <td v-else></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
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
        loadTodos: false,
        loadMarkAsDoneButton: []
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
      this.todos = [];

      this.getAccountTodos().then(accountTodos => {        
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
        console.err('Todo title missing in function addTodo');
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
      this.$set(this.load.loadMarkAsDoneButton, id, true);
      
      try {
        await this.todoListInstance.methods.markTodoAsDone(id).send({
          from: this.userAccount
        });

        this.updateTodos();
        this.$set(this.load.loadMarkAsDoneButton, id, false);
      } catch(err) {
      this.$set(this.load.loadMarkAsDoneButton, id, false);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
