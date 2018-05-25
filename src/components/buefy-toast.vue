<template>
	<transition
		:enter-active-class="transition.enter"
		:leave-active-class="transition.leave">
		<div
			v-show="isActive"
			class="toast"
			:class="[type, position]">
			<div v-html="message"/>
		</div>
	</transition>
</template>

<script>
import validationMixin from '~/utils/toast-mixin.js'

export default {
	mixins: [validationMixin],
	data () {
		return {
			newDuration: this.duration || 2000
		}
	}
}
</script>
