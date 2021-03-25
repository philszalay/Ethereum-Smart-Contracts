<template>
  <div v-if="userAccount">
  <h1>Using Account:</h1>
  <span>{{userAccount}}</span>
  <form @submit.prevent="addTodo">
    <input v-model="todoTitleInput" placeholder="Todo title">
    <button type="submit">Add Todo</button>
  </form>
  </div>
  <span v-else>Please connect this Site with MetaMask</span>
</template>

<script>
import Web3 from 'web3';

export default {
  name: 'TodoList',
  data() {
    return {
      todoListContractAddress: '0x3Be85DfabA0f33Cb1568F1Bb0538d6F38F8e3fe2',
      web3: new Web3(Web3.givenProvider || new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/0ea14456f513454ea520fd84dc9083a9')),
      todoListAbi: [
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "_content",
              "type": "bytes32"
            }
          ],
          "name": "addTodo",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
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
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_id",
              "type": "uint256"
            }
          ],
          "name": "markTodoAsDone",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "maxAmountOfTodosForUser",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
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
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }
      ],
      todoListInstance: null,
      userAccount: null,
      todoTitleInput: ''
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
    getTodos: function() {
      this.todoListInstance.methods.todos().call().then(todos => {
        console.log(todos);
      });
    },
    addTodo: function() {
      console.log(this.todoTitleInput);
      if(this.todoTitleInput.length <= 0) {
        console.log('Todo title missing in function addTodo');
        return;
      }
      
      this.todoListInstance.methods.addTodo(this.web3.utils.asciiToHex(this.todoTitleInput)).send({
        from: this.userAccount
      }).then(() => {
        // Update the todos after inserting a new one  
        this.getTodos();
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
