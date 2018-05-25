<template>
		<div>
			<div class="quill-editor"
			:ref="'quill' + name"
			:name="name"
			v-quill="config"
			v-bind:content="content"
			v-on:change="$emit('input', $event.html)"
			style="min-height:250px"
			></div>
		</div>
</template>

<style lang="css">
@import '~/node_modules/quill/dist/quill.snow.css';
</style>

<script>
import Vue from 'vue'

if (process.browser) {
	const VueQuillEditor = require('vue-quill-editor/dist/ssr')
	Vue.use(VueQuillEditor)
}

export default {
	model: {
		prop: 'content',
		event: 'input'
	},
	props: {
		name: { default: '' },
		content: { default: '' },
		config: { default: function () { return {} } }
	}
}
</script>
