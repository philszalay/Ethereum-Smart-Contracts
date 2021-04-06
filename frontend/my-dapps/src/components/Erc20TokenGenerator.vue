<template>
  <div>
    <h1 class="text-center">ERC20 Token Generator</h1>
  </div>
</template>

<script>
export default {
  name: "Erc20TokenGenerator",
  props: ["webThree", "userAccount"],
  data() {
    return {
      todoListContractAddress: "0x95C0e3761b6CbdF51f673d9884ad862aD792180B",
      todoListAbi: null,
      todoListInstance: null,
    };
  },
  beforeMount() {
    // Get contract ABI from truffle build folder
    this.todoListAbi = require("../../../../build/contracts/DappsUniverseTokenFactory.json")[
      "abi"
    ];

    // Get contract instance from Blockchain.
    this.todoListInstance = new this.webThree.eth.Contract(
      this.todoListAbi,
      this.todoListContractAddress
    );

    this.todoListInstance.methods
      .getERC20DappsUniverseFixedSupplyAddresses()
      .call((err, res) => {
        console.log(err, res);
      });

    console.log(this.todoListAbi);

    this.todoListInstance.methods
      .createERC20DappsUniverseFixedSupply(555, "Phil Coin", "PSCT")
      .send(
        {
          from: this.userAccount,
        },
        (err, res) => {
          console.log(err, res);
        }
      );
  },
};
</script>


<style scoped>
</style>