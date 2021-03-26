<template>
  <v-app id="inspire">
    <v-container>
      <todo-list></todo-list>
    </v-container>
  </v-app>
</template>

<script>
import TodoList from './components/TodoList';

export default {
  name: 'App',

  components: {
    TodoList,
  },

  data: () => ({
    //
  }),
};
</script>
