<template>
  <v-app id="inspire">
    <v-toolbar>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>Dapps Universe</v-toolbar-title>
        <span>Using Account: {{userAccount}}</span>
    </v-toolbar>
    <v-main>
      <v-container v-if="!userAccount" fluid>
          <span>Please connect this Site with MetaMask</span>
      </v-container>
      <v-container v-else fluid>
        <todo-list :web-three="web3" :user-account="userAccount"></todo-list>
      </v-container>
    </v-main>
    <v-footer app>
      Impressum
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
    userAccount: null,
    web3: new Web3(
        Web3.givenProvider ||
          new Web3.providers.HttpProvider(
            "https://ropsten.infura.io/v3/0ea14456f513454ea520fd84dc9083a9"
          )
      )
  }),
  beforeMount: function() {
    // Connect with MetaMask and set userAccount to first MetaMask account.
    window.ethereum.enable().then(() => {
      this.web3.eth.getAccounts().then((accounts) => {
        this.userAccount = accounts[0];
      });
    });
  }
};
</script>
