<template>
  <div id="app">

    <div class="container">
      <h1 class="title has-text-centered is-1">{{ title }}</h1>
      <br>

      <buefyFormGenerator
      ref="form"
      v-if="schema"
      :schema="schema"
      @changed="changed($event)"
      @canceled="canceled($event)"
      @validation="$event ? save() : ''"
      />
    </div>
  </div>
</template>

<style lang="scss">
@import "./assets/buefy-form-generator.scss";
</style>

<style lang="css">
@import "~/node_modules/mdi/css/materialdesignicons.min.css";
@import "~/node_modules/buefy/lib/buefy.min.css";
</style>

<script>
import Vue from 'vue'
import Toast from './utils/buefy-toasts.js'

export default {
  name: 'app',
  components: { 'buefyFormGenerator': () => import('./components/buefy-form-generator.vue') },
  data () {
    return {
      schema: {},
      title: 'Buefy Form Generator'
    }
  },
	mounted () {
		const SCHEMA = require('./schema-example.js').default.getSchema(this.data)
    this.schema = SCHEMA.schema
	},
  methods: {
    changed (e) {
      console.log(e)
    },
    canceled (e) {
      const message = e.name + ' canceled!'
      Toast.open({ duration: 3000, message: message, position: 'is-bottom', type: 'is-danger' })
    },
    save () {
      const message = 'Form saved!'
      Toast.open({ duration: 3000, message: message, position: 'is-bottom', type: 'is-success' })
    }
  }
}
</script>
