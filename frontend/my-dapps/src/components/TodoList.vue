<template>
  <div>
    <h1 class="text-center">Todo List Dapp
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="" @click="openEtherscanTab()" v-bind="attrs" v-on="on" rounded small>
            <v-icon small>mdi-arrow-top-right</v-icon>
          </v-btn>
        </template>
        <span>View on Etherscan</span>
      </v-tooltip>
    </h1>
    <v-row>
    <v-spacer></v-spacer>
    <v-col>
      <v-form @submit.prevent="addTodo">
        <v-text-field
          v-model="todoTitleInput"
          label="Add Todo"
          required
        ></v-text-field>
        <v-btn type="submit" :loading="load.addTodo" :disabled="todoTitleInput.length === 0 || load.addTodo">Add Todo</v-btn>
      </v-form>
    </v-col>
    <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col>          
        <v-simple-table>
        <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Id</th>
            <th class="text-left">Title</th>
            <th class="text-left">Done</th>
            <th class="text-right"><v-btn icon color="green" @click="updateTodos()"><v-icon>mdi-cached</v-icon></v-btn></th>
          </tr>
        </thead>
        <tbody>
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
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "TodoList",
  props: ['webThree', 'userAccount'],
  data() {
    return {
      todoListContractAddress: "0xaebdbd7a9A884e6B9040c68B61e00b2907Dacd26",
      todoListAbi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "lastIds",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [],
          name: "maxAmountOfTodosForUser",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "todos",
          outputs: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "content",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "creationDate",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "bool",
              name: "isDone",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [],
          name: "getAllTodos",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
                {
                  internalType: "bytes32",
                  name: "content",
                  type: "bytes32",
                },
                {
                  internalType: "uint256",
                  name: "creationDate",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  internalType: "bool",
                  name: "isDone",
                  type: "bool",
                },
              ],
              internalType: "struct ToDoList.Todo[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [],
          name: "getAccountTodos",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
                {
                  internalType: "bytes32",
                  name: "content",
                  type: "bytes32",
                },
                {
                  internalType: "uint256",
                  name: "creationDate",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  internalType: "bool",
                  name: "isDone",
                  type: "bool",
                },
              ],
              internalType: "struct ToDoList.Todo[100]",
              name: "",
              type: "tuple[100]",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "_content",
              type: "bytes32",
            },
          ],
          name: "addTodo",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_id",
              type: "uint256",
            },
          ],
          name: "markTodoAsDone",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      todoListInstance: null,
      todoTitleInput: "",
      todos: [],
      load: {
        addTodo: false,
        loadTodos: false,
        loadMarkAsDoneButton: [],
      },
    };
  },
  beforeMount() {
    // Get contract instance from Blockchain.
    this.todoListInstance = new this.webThree.eth.Contract(
      this.todoListAbi,
      this.todoListContractAddress
    );
      
    this.updateTodos();
  },
  methods: {
    updateTodos: function () {
      this.load.loadTodos = true;
      this.todos = [];

      this.getAccountTodos().then((accountTodos) => {
        if (!accountTodos) {
          return;
        }

        accountTodos.forEach((todo, index) => {
          if (todo.id !== "0" || index === 0) {
            this.todos.push({
              title: this.webThree.utils.hexToAscii(todo.content),
              id: todo.id,
              isDone: todo.isDone,
            });
          }

          this.load.loadTodos = false;
        });
      });
    },
    getAccountTodos: async function () {
      try {
        return await this.todoListInstance.methods.getAccountTodos().call({
          from: this.userAccount,
        });
      } catch (err) {
        // TODO: Handle error
        this.load.loadTodos = false;
      }
    },
    addTodo: async function () {
      this.load.addTodo = true;

      if (this.todoTitleInput.length <= 0) {
        console.err("Todo title missing in function addTodo");
        return;
      }

      try {
        await this.todoListInstance.methods
          .addTodo(this.webThree.utils.asciiToHex(this.todoTitleInput))
          .send({
            from: this.userAccount,
          });

        this.todoTitleInput = "";
        this.updateTodos();

        this.load.addTodo = false;
      } catch (err) {
        // TODO: Handle error
        this.load.addTodo = false;
      }
    },
    markTodoAsDone: async function (id) {
      this.$set(this.load.loadMarkAsDoneButton, id, true);

      try {
        await this.todoListInstance.methods.markTodoAsDone(id).send({
          from: this.userAccount,
        });

        this.updateTodos();
        this.$set(this.load.loadMarkAsDoneButton, id, false);
      } catch (err) {
        this.$set(this.load.loadMarkAsDoneButton, id, false);
      }
    },
    openEtherscanTab: function() {
      window.open('https://ropsten.etherscan.io/address/' + this.todoListContractAddress, '_blank');
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
