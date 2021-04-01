<template>
  <v-app id="inspire">
    <v-app-bar app>
      <v-app-bar-title>Dapps Universe</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-chip v-if="userAccount" color="green" label>
        Account: {{userAccount}}
      </v-chip>
      <v-chip v-else color='red' label>
        Account not connected 
      </v-chip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <a href="https://github.com/philszalay/Ethereum-Smart-Contracts" target="_blank" v-bind="attrs" v-on="on" class="margin-left">
            <v-img :src="require('@/assets/images/GitHub-Mark-Light-32px.png')" class="github-icon" />
          </a>
        </template>
        <span>View on GitHub</span>
      </v-tooltip>
      <template v-slot:extension>
        <v-tabs
          v-model="selectedDapp"
          fixed-tabs
          color="yellow"
        >
          <v-tabs-slider></v-tabs-slider>
          <v-tab class="yellow--text">Todo List Dapp</v-tab>
          <v-tab class="yellow--text">ERC20 Token Generator</v-tab>
          <v-tab class="yellow--text">ERC721 Token Generator</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main>
      <v-container v-if="!userAccount" fluid>
          <span>Please connect this Site with MetaMask</span>
      </v-container>
      <v-container v-else fluid>
        <todo-list v-if="selectedDapp === 0" :key="todoListComponentKey" :web-three="web3" :user-account="userAccount"></todo-list>
        <erc-20-token-generator v-if="selectedDapp === 1" :key="todoListComponentKey" :web-three="web3" :user-account="userAccount"></erc-20-token-generator>
        <erc-721-token-generator v-if="selectedDapp === 2" :key="todoListComponentKey" :web-three="web3" :user-account="userAccount"></erc-721-token-generator>
      </v-container>
    </v-main>
    <v-footer app>
      <v-col>
        <span>&#169;<strong>{{currentYear}}</strong></span>
      </v-col>
      <!-- <v-col>
        <a>Contact</a>
      </v-col> -->
    </v-footer>
  </v-app>
</template>

<script>
import TodoList from './components/TodoList';
import Erc20TokenGenerator from './components/Erc20TokenGenerator'
import Erc721TokenGenerator from './components/Erc721TokenGenerator'
import Web3 from "web3";

export default {
  name: 'App',

  components: {
    TodoList,
    Erc20TokenGenerator,
    Erc721TokenGenerator
  },

  data: () => ({
    todoListComponentKey: 0,
    userAccount: null,
    web3: new Web3(
        Web3.givenProvider ||
          new Web3.providers.HttpProvider(
            "https://ropsten.infura.io/v3/0ea14456f513454ea520fd84dc9083a9"
          )
      ),
    currentYear: new Date().getFullYear(),
    selectedDapp: ''
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

<style>
  .container {
    margin-top: 24px;
  }

  .margin-left {
    margin-left: 16px;
  }

  .margin-right {
    margin-right: 16px;
  }

  .github-icon {
    width: 24px;
    height: 24px;
  }
</style>
