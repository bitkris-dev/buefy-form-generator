<template>
	<div>
		<div class="quill-editor"
		:ref="'quill' + name"
		:name="name"
		v-quill="config"
		v-bind:content="content"
		v-on:change="$emit('input', $event.html)"
		></div>
	</div>
</template>

<script>
import Vue from 'vue'

export default {
	name: 'quill-editor',
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
