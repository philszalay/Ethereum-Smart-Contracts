<template>
  <v-app id="inspire">
    <v-app-bar app>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-app-bar-title>Dapps Universe</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-chip v-if="userAccount" color="green" label>
        Account: {{userAccount}}
      </v-chip>
      <v-chip v-else color='red' label>
        Account not connected 
      </v-chip>
    </v-app-bar>
    <v-main>
      <v-container v-if="!userAccount" fluid>
          <span>Please connect this Site with MetaMask</span>
      </v-container>
      <v-container v-else fluid>
        <todo-list :key="todoListComponentKey" :web-three="web3" :user-account="userAccount"></todo-list>
      </v-container>
    </v-main>
    <v-footer app>
      
    </v-footer>
  </v-app>
</template>

<script>
import TodoList from './components/TodoList';
import Web3 from "web3";

export default {

  name: 'App',

  components: {
    TodoList,
  },

  data: () => ({
    todoListComponentKey: 0,
    userAccount: null,
    web3: new Web3(
        Web3.givenProvider ||
          new Web3.providers.HttpProvider(
            "https://ropsten.infura.io/v3/0ea14456f513454ea520fd84dc9083a9"
          )
      )
  }),
  mounted: function() {
    window.ethereum.on('accountsChanged',(accounts) => {
      this.userAccount = accounts[0];
      // Force re-rendering of TodoList component
      this.todoListComponentKey += 1;
    });

    // Connect with MetaMask and set userAccount to first MetaMask account.
    window.ethereum.enable().then(() => {
      this.web3.eth.getAccounts().then((accounts) => {
        this.userAccount = accounts[0];
      });
    });
  }
};
</script>
