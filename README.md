
# buefy-form-generator

> A form generator component for VueJS, built on top of Buefy components and with Nuxt.js/SSR support

## Install

• Add dependencies to your npm/yarn package manager:

``` bash
npm install awesome-phonenumber buefy mdi moment nuxt-dropzone vee-validate vue-quill-editor vue-scrollto
# OR
yarn add awesome-phonenumber buefy mdi moment nuxt-dropzone vee-validate vue-quill-editor vue-scrollto
```

• Install the form generator:

``` bash
npm install buefy-form-generator
# OR
yarn add buefy-form-generator
```

• Configure and use plugins in the direct parent **.vue** file in which you will use the `<buefyFormGenerator>` component:

``` bash
import Vue from  'vue'

# it's better to import components a-la-carte
import Datepicker from  'buefy/src/components/datepicker/Datepicker.vue'
import Timepicker from  'buefy/src/components/timepicker/Timepicker.vue'
import Field from  'buefy/src/components/field/Field.vue'
import Select from  'buefy/src/components/select/Select.vue'
import Input from  'buefy/src/components/input/Input.vue'
import Checkbox from  'buefy/src/components/checkbox/Checkbox.vue'
import Switch from  'buefy/src/components/switch/Switch.vue'
import Message from  'buefy/src/components/message/Message.vue'
import Icon from  'buefy/src/components/icon/Icon.vue'
import Loading from  'buefy/src/components/loading/Loading.vue'

# this package already deals with all the validation through Vee-Validate
import VeeValidate,  { ErrorComponent }  from  'vee-validate'

# needed to scroll to the error
import VueScrollTo from  'vue-scrollto'

# install buefy-form-generator
Vue.component('buefyFormGenerator', require('buefy-form-generator'))

# install components
Vue.component(Datepicker.name, Datepicker)
Vue.component(Timepicker.name, Timepicker)
Vue.component(Field.name, Field)
Vue.component(Select.name, Select)
Vue.component(Input.name, Input)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Switch.name, Switch)
Vue.component(Message.name, Message)
Vue.component(Icon.name, Icon)
Vue.component(Loading.name, Loading)

# this is the VeeValidate config, you can customize it
const vvConfig =  { enableAutoClasses:  true, events:  'blur, change', errorBagName:  'vErrors'  }
Vue.use(VeeValidate, vvConfig)
Vue.component('vv-error', ErrorComponent)

# use vue-scrollto
Vue.use(VueScrollTo)

[...]

```

Import its css:

``` bash
<style lang="css">
[...]

@import 'node_modules/buefy-form-generator/dist/bfg.css';

[...]
</style>
```

## How to use

This form generator parses a simple JSON schema to generate all what you need in a common form.
Create a JSON object for each input you want to create as follows:

``` bash
{
   [...]
   "inputName": { options },
   [...]
}
```

### Configurable input options

| Name | Type | Default | Description
|--|--|--|--|
|`header`|`{Object}`|`undefined`|Adds a `<h1 class="title is-5"></h1>` before the input. <br><br> Supported keys: <br>• **icon**: `{String}` <br> &nbsp;&nbsp; *(icon class name from [MDI](hhttps://materialdesignicons.com/) )*  <br> • **text**: `{String}` |
|`appearance`|`{Object}`|`undefined`|With this property, you can customize the input's look and layout. <br><br> Supported keys:<br> • **label**: `{String}`  <br> • **icon**: `{String}` <br> &nbsp;&nbsp; *(icon class name from [MDI](hhttps://materialdesignicons.com/) )* <br> • **layout**: `{String}`  <br>&nbsp;&nbsp; (add *here your CSS classes)* |
|`data`|`{Object}`|`undefined`|Configure the data properties, types and validation rules. <br><br> Supported keys: <br> • **value**: `any type`  <br>  &nbsp;&nbsp; (*use this for editable values, otherwise set to* `null` *for empty forms*.) <br> • **type**: `{String}`  <br>  &nbsp;&nbsp; (*can be one of the following values:*  `text`, `textarea`, `richtext`, `number`, `password`, `checkbox`, `switch`, `select`, `phone`, `date`, `time`, `dropzone`, `html`, `link`)<br> • **disabled**: `{Boolean}`<br> • **disabled**: `{Boolean}`<br> • **noSend**: `{Boolean}`<br>  &nbsp;&nbsp; (*If you want to show an input excluding it from the values passed via the* `@changed` *event. Best to use it with* **disabled**: `true`.) <br> • **validate**: `{String}` <br>  &nbsp;&nbsp; (*Insert your vee-validate validation rules. [Click this link](https://baianat.github.io/vee-validate/guide/rules.html) to see what is available*) <br>  <br> ╚ If (**type** = `html`) <br> • **html:**  `{String}`  <br> &nbsp;&nbsp; (*HTML elements will always work as if* **noSend**  *is set to `true`* for them.) <br>  <br> ╚ If (**type** = `dropzone`) <br> • **button:**  `{String}`  <br> • **options:**  `{String}`<br><br> ╚ If (**type** = `select`) <br> • **options:**  `{Array}` <br>  &nbsp;&nbsp; (*Array of objects with this format: `{text: "text", value: "value"}`*) <br><br> ╚ If (**type** = `number`) <br> • **step:**  `{Float}`  <br> • **min:**  `{Float}`

### Example

``` bash
{
   # Text
   "name":  {
      "header":  {  "icon":  "information",  "text":  "General Info"  },
      "appearance":  {  "label":  "Name and Surname",  "icon":  "format-text",  "layout":  "column is-12-mobile is-6-tablet is-6-desktop is-6-widescreen"  },
      "data":  {  "value":  null,  "type":  "text",  "validate":  "required|min:3"  }
   },

   # Richtext
   "bio":  {
      "appearance":  {  "label":  "Biography",  "icon":  "format-text",  "layout":  "column is-12-mobile is-6-tablet is-6-desktop is-6-widescreen"  },
      "data":  {  "value":  "A sample biography",  "type":  "richtext",  "validate":  "required|min:20"  }
   },

   # Select
   "gender":  {
      "appearance":  {  "label":  "Gender",  "icon":  " human-male-female",  "layout":  "column is-12-mobile is-6-tablet is-6-desktop is-6-widescreen"  },
      "data": { "value": null, "type": "select",
         "options": [
            { "text": "Male", "value": "gender-male"},
            { "text": "Female", "value": "gender-female"}
         ]
      }
   },

   # Date
   "birth_date":  {
      "header":  {  "icon":  "calendar-multiple",  "text":  "Dates"  },
      "appearance":  {  "label":  "Birth date",  "icon":  "calendar-clock",  "layout":  "column is-12-mobile is-6-tablet is-6-desktop is-6-widescreen"  },
      "data":  {  "value":  null,  "type":  "date",  "validate":  "required|date_format:DD/MM/YYYY"  }
   },

   # Time
   "time": {
      "header": { "icon": "clock", "text": "Time" },
      "appearance": { "label": "Scheduled time", "icon": "clock", "layout": "column is-6" },
      "data": { "value": null, "type": "time" }
   },

   # checkbox
   "checkbox": {
      "appearance": { "label": "Are you a PRO?", "icon": "format-text", "layout": "column is-3" },
      "data": { "value": "No", "type": "checkbox" }
   },

   # Switch
   "switch": {
      "header": { "icon": "toggle-switch", "text": "Enable" },
      "appearance": { "label": "Publish your profile", "icon": "format-text", "layout": "column is-3" },
      "data": { "value": "No", "type": "switch" }
   },

   # HTML
   "guide":  {
      "header":  {  "icon":  "information",  "text":  "Guide"  },
      "appearance":  {  "label":  "Guide",  "layout":  "column is-12-mobile is-6-tablet is-6-desktop is-6-widescreen"  },
      "data":  {  "html":  "Here you can insert as much <b>HTML</b> you wish. Any tag whatsoever.",  "type":  "html"  }
   },

   # Dropzone
   "image": {
      "header": { "icon": "file-multiple", "text": "Avatar" },
      "appearance": { "label": "Avatar", "layout": "column is-6" },
      "data": {
         "value": null,
         "type": "dropzone",
         "button": "Change avatar",
         "options": {
            "maxFiles": 1,
            "url": "/",
            "uploadMultiple": false,
            "createImageThumbnails": true,
            "acceptedFiles": ".jpg, .jpeg, .png"
         }
      }
   }
}
```

## To contribute

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
