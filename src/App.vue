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

import quillEditor from './components/quillEditor.vue'
import dropzoneWrap from './components/dropzoneWrap.vue'

import Datepicker from 'buefy/src/components/datepicker/Datepicker.vue'
import Field from 'buefy/src/components/field/Field.vue'
import Select from 'buefy/src/components/select/Select.vue'
import Input from 'buefy/src/components/input/Input.vue'
import Checkbox from 'buefy/src/components/checkbox/Checkbox.vue'
import Switch from 'buefy/src/components/switch/Switch.vue'
import Message from 'buefy/src/components/message/Message.vue'
import Icon from 'buefy/src/components/icon/Icon.vue'
import Loading from 'buefy/src/components/loading/Loading.vue'

import VeeValidate, { Validator, ErrorComponent } from 'vee-validate'

import VueScrollTo from 'vue-scrollto'

Vue.component('quillEditor', quillEditor)
Vue.component('dropzoneWrap', dropzoneWrap)

Vue.component(Datepicker.name, Datepicker)
Vue.component(Field.name, Field)
Vue.component(Select.name, Select)
Vue.component(Input.name, Input)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Switch.name, Switch)
Vue.component(Message.name, Message)
Vue.component(Icon.name, Icon)
Vue.component(Loading.name, Loading)

const vvConfig = { enableAutoClasses: true, events: 'blur, change', errorBagName: 'vErrors' }
Vue.use(VeeValidate, vvConfig)
Vue.component('vv-error', ErrorComponent)

Vue.use(VueScrollTo)

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
