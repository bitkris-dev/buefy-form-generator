<template>
	<div class="columns is-multiline">
		<template v-for="(input,key,index) in schema" v-if="(input.data.type === 'html' && input.data.html) || input.data.type !== 'html'">
			<div class="column is-12" v-if="input.header" :key="key + '-header'">
				<div>
					<template v-if="index !== 0"><hr><br></template>
					<h1 class="title is-5">
						<b-icon style="transform:translateY(2px)" class="margin-right-xsmall" :icon="input.header.icon" />
						{{input.header.text}}
					</h1>
				</div>
			</div>

			<div :class="input.appearance.layout" :key="key + '-field'">
				<div>
					<b-field
					:class="(input.appearance.classField || '') + ' field-' + input.data.type"
					:label="labelGen(input.data.type, input.appearance.label, input.data.options || null)">
						<div style="position:relative">
							<template v-if="input.data.type === 'html'">
								<div v-html="input.data.html"></div>
							</template>

							<template v-else-if="input.data.type === 'link'">
								<a :href="input.data.linkTo" :target="input.data.targetTo">{{input.data.text}}</a>
							</template>

							<template v-else-if="BInputTypes.indexOf(input.data.type) > -1">
								<b-input
								:name="key"
								:type="(input.data.type === 'phone') ? 'text' : input.data.type"
								:class="input.appearance.classInput || ''"
								:icon="input.appearance.icon"
								:readonly="input.data.readonly || false"
								:disabled="input.data.disabled || false"
								:step="input.data.step || false"
								:min="input.data.min || false"
								:placeholder="input.data.placeholder || input.appearance.label || ''"
								v-model="input.data.value"
								v-validate="input.data.validate || ''"
								:data-vv-as="input.appearance.label"
								@input="emitter($event, key, 'changed')"
								/>
								<b-icon v-if="!input.data.disabled && !input.data.readonly" icon="close-circle" @click.native="input.data.value = null; emitter(null, key, 'changed')" />
							</template>

							<template v-else-if="input.data.type === 'switch'">
								<b-switch
								:name="key"
								:type="input.data.type"
								:class="input.appearance.classInput || ''"
								:disabled="input.data.disabled || false"
								true-value="Yes"
								false-value="No"
								v-model="input.data.value"
								@input="emitter($event, key, 'changed')"
								>{{input.data.value}}</b-switch>
							</template>

							<template v-else-if="input.data.type === 'checkbox'">
								<b-checkbox
								:name="key"
								:type="input.data.type"
								:class="input.appearance.classInput || ''"
								:disabled="input.data.disabled || false"
								v-model="input.data.value"
								@input="emitter($event, key, 'changed')"
								><b>{{input.appearance.label}}</b></b-checkbox>
							</template>

							<template v-else-if="input.data.type === 'select'">
								<b-select
								:name="key" v-model="input.data.value"
								:class="input.appearance.classInput || ''"
								:icon="input.appearance.icon"
								:placeholder="input.data.placeholder || input.appearance.label || ''"
								:disabled="input.data.options ? input.data.options.length === 0 : true"
								:loading="input.data.options ? input.data.options.length === 0 : true"
								@input="emitter($event, key, 'changed')"
								>
									<option v-for="(option,index) in input.data.options" :value="option.value" :key="index">
										{{ option.text }}
									</option>
								</b-select>
							</template>

							<template v-else-if="input.data.type === 'date'">
								<b-datepicker
								:name="key"
								:class="input.appearance.classInput || ''"
								:icon="input.appearance.icon"
								:placeholder="input.data.placeholder || input.appearance.label || ''"
								:disabled="input.data.disabled || false"
								v-model="input.data.value"
								v-validate="input.data.validate || 'date_format:DD/MM/YYYY'"
								:data-vv-as="input.appearance.label"
								@input="emitter($event, key, 'changed')"
								/>
								<b-icon v-if="!input.data.disabled && !input.data.readonly" icon="close-circle" @click.native="input.data.value = null; emitter(null, key, 'changed')" />
							</template>

							<template v-else-if="input.data.type === 'time'">
								<b-timepicker
								:name="key"
								:class="input.appearance.classInput || ''"
								:icon="input.appearance.icon"
								:placeholder="input.data.placeholder || input.appearance.label || ''"
								:disabled="input.data.disabled || false"
								v-model="input.data.value"
								v-validate="input.data.validate"
								:data-vv-as="input.appearance.label"
								@input="emitter($event, key, 'changed')"
								/>
								<b-icon v-if="!input.data.disabled && !input.data.readonly" icon="close-circle" @click.native="input.data.value = null; emitter(null, key, 'changed')" />
							</template>

							<template v-else-if="input.data.type === 'dropzone'">
								<dropzone-wrap
								:keyName="key"
								:class="input.appearance.classInput || ''"
								:value="input.data.value"
								:options="input.data.options"
								:button="input.data.button"
								@input="emitter($event, key, 'changed')"
								@cancel="$emit('canceled', {value: $event, name: key})"
								/>
							</template>

							<template v-else-if="input.data.type === 'richtext'">
								<quill-editor
								:ref="'quill-' + key"
								:name="key"
								:class="input.appearance.classInput || ''"
								:config="parseQuillOptions(input.data.options)"
								v-model="input.data.value"
								@input="emitter($event, key, 'changed')"
								/>
							</template>
						</div>
					</b-field>

					<div class="v-error tc-red margin-top-xsmall" v-if="vErrors.has(key)">
						<vv-error :for="key" />
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@import '../assets/buefy-form-generator.scss';
</style>

<script>
const PhoneNumber = require('awesome-phonenumber')

export default {
	name: 'buefyFormGenerator',
	components: {
		'quillEditor': (process.env.NODE_ENV === 'development') ? require('./quill-editor.vue').default : require('../../quill-editor/quill-editor.common.js'),
		'dropzoneWrap': (process.env.NODE_ENV === 'development') ? require('./dropzone-wrap.vue').default : require('../../dropzone-wrap/dropzone-wrap.common.js')
	},
	data () {
		return {
			canUpload: {},
			processing: true,
			original_schema: JSON.parse(JSON.stringify(this.schema)),
			BInputTypes: ['text', 'phone', 'password', 'number', 'textarea']
		}
	},
	props: {
		schema: { default: {} }
	},
	computed: {
		schemaData () {
			let wholeSchema = this.schema
			let schemaKeys = Object.keys(wholeSchema)
			let schemaValues = Object.values(wholeSchema)
			let schemaData = {}

			for (let i = 0; i < schemaValues.length; i++) {
				let key = schemaKeys[i]
				let val = schemaValues[i].data

				if (!val.noSend) {
					let assign = val.value
					if (val.type === 'number') assign = parseFloat(assign)
					if (val.type === 'date') { assign = assign ? require('moment').utc(assign).format('DD/MM/YYYY') : null }
					if (val.type === 'switch') assign = (assign === 'Yes')
					schemaData[key] = assign
				}
			}

			return schemaData
		}
	},
	created () {
		this.$validator.extend('phone', {
			getMessage: field => 'This phone number is not valid',
			validate: value => new PhoneNumber(value, 'en').isValid()
		})
	},
	methods: {
		saveToOriginalSchema (schema) {
			// save only once
			if (!Object.keys(this.original_schema).length) this.original_schema = JSON.parse(JSON.stringify(schema))
		},
		parseQuillOptions (opt) {
			let options = (opt || {})
			options.theme = 'snow'
			return options
		},
		labelGen (type, sourceLabel, options) {
			let label = null
			let fileTypes = null

			if (type !== 'checkbox') label = sourceLabel
			if (type === 'file') {
				if (options) fileTypes = options.acceptedFiles.toString().replace(/,/g, ', ')
				label = sourceLabel + ' (' + fileTypes + ')'
			}

			return label
		},
		validateSingle (e) {
			let valType = (typeof e)
			let inputName = valType === 'string' ? e : e.target.getAttribute('name')

			setTimeout(() => { this.$validator.validate(inputName, this.schemaData[inputName]) }, 10)
		},
		validateAll () {
			this.$validator.validateAll().then(res => {
				this.$emit('validation', res)

				if (!res) {
					this.$nextTick(() => {
						let errors = document.querySelectorAll('.v-error')
						// console.log([...errors].filter(v => { if (v.childNodes[0].innerHTML) return v }))
						this.$scrollTo(errors[0], 500, { offset: -200 })
					})
				}
			})
		},
		emitter (e, key, eventToEmit) {
			if (this.schema[key].data.validate) if (this.original_schema[key].data.value || this.vErrors.has(key)) this.validateSingle(key)
			this.$emit(eventToEmit, {value: this.schemaData[key], value_native: e, name: key})
		}
	},
	watch: {
		'schema' (newVal) { this.saveToOriginalSchema(newVal) }
	}
}
</script>
