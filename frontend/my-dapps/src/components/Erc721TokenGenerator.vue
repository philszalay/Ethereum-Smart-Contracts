<template>
  <div>
    <h1 class="text-center">ERC721 Token Generator</h1>
    <v-row>
      <v-spacer></v-spacer>
      <v-col>
        <v-form @submit.prevent="createToken">
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
          <v-text-field
            type="number"
            v-model="token.decimalPlaces"
            label="Decimal Places"
            required
          ></v-text-field>
          <v-text-field
            type="number"
            v-model="token.numberOfTokens"
            label="Number of Tokens in Circulation"
            required
          ></v-text-field>
          <v-btn
            type="submit"
            :loading="load.createToken"
            >Create ERC721 Token</v-btn
          >
        </v-form>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Erc721TokenGenerator",
  data() {
    return {
        token: {},
        load: {
            createToken: false
        }
    };
  },
  methods: {
      createToken: function() {
          // TODO: Form validation
          return;
      }
  }
};
</script>


<style scoped>
</style>