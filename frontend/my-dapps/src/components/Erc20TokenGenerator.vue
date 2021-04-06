<template>
  <div>
    <h1 class="text-center">ERC20 Token Generator</h1>
    <v-row>
      <v-spacer></v-spacer>
      <v-col>
        <v-form @submit.prevent="generateToken">
          <v-text-field
            v-model="token.name"
            label="Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="token.symbol"
            label="Symbol"
            required
          ></v-text-field>
          <v-select
            :items="tokenOptions"
            label="Token Type"
            v-model="token.type"
          ></v-select>
          <v-text-field
            :disabled="true"
            label="Decimal Places (18)"
            required
          ></v-text-field>
          <v-text-field
            type="number"
            min="0"
            v-model="token.supply"
            label="Number of Tokens in Circulation"
            required
          ></v-text-field>
          <v-btn type="submit" :loading="load.generateToken"
            >Create ERC20 Token</v-btn
          >
          <div class="form-error-list">
            <span v-for="(error, index) in errors" :key="index"
              >{{ error }}<br
            /></span>
          </div>
        </v-form>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col>
        {{ this.addresses }}
      </v-col>
      <v-col>
        <v-btn @click="updateAddresses()">Update adresses</v-btn>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Erc20TokenGenerator",
  props: ["webThree", "userAccount"],
  data() {
    return {
      DappsUniverseTokenFactoryContractAddress:
        "0x95C0e3761b6CbdF51f673d9884ad862aD792180B",
      DappsUniverseTokenFactoryAbi: null,
      DappsUniverseTokenFactoryInstance: null,
      token: {},
      load: {
        createToken: false,
      },
      addresses: [],
      tokenOptions: ["Dapps Universe Fixed Supply"],
      errors: [],
    };
  },
  beforeMount() {
    // Get contract ABI from truffle build folder
    this.DappsUniverseTokenFactoryAbi = require("../../../../build/contracts/DappsUniverseTokenFactory.json")[
      "abi"
    ];

    // Get contract instance from Blockchain.
    this.DappsUniverseTokenFactoryInstance = new this.webThree.eth.Contract(
      this.DappsUniverseTokenFactoryAbi,
      this.DappsUniverseTokenFactoryContractAddress
    );

    this.updateAddresses();
  },
  methods: {
    updateAddresses: function () {
      this.getAddresses().then((addresses) => {
        this.addresses = addresses;
      });
    },
    getAddresses: async function () {
      return this.DappsUniverseTokenFactoryInstance.methods
        .getERC20DappsUniverseFixedSupplyAddresses()
        .call();
    },
    checkForm: function () {
      if (
        this.token.name &&
        this.token.symbol &&
        this.token.supply &&
        this.token.supply > 0 &&
        this.token.type
      ) {
        this.errors = [];
        return true;
      }

      this.errors = [];

      if (!this.token.name) {
        this.errors.push("Token name required");
      }

      if (!this.token.symbol) {
        this.errors.push("Token symbol required");
      }

      if (!this.token.supply) {
        this.errors.push("Token supply is required");
      } else if (this.token.supply < 1) {
        this.errors.push("Token supply must be greater than 0");
      }

      if (!this.token.type) {
        this.errors.push("Token type is required");
      }

      return false;
    },
    generateToken: async function () {
      if (!this.checkForm()) {
        return false;
      }

      try {
        await this.DappsUniverseTokenFactoryInstance.methods
          .createERC20DappsUniverseFixedSupply(
            this.token.supply,
            this.token.name,
            this.token.symbol
          )
          .send({
            from: this.userAccount,
          });

        this.token = {};
      } catch (err) {
        // TODO: Handle error
      }
    },
  },
};
</script>


<style scoped>
</style>