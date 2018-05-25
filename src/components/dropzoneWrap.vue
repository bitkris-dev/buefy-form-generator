<template>
	<div class="columns is-multiline">
		<div class="column is-12-mobile is-12-tablet is-12-desktop" :class="canUpload ? 'is-4-widescreen no-padding' : 'is-12-widescreen'">
			<div v-show="!canUpload" class="dropzone-previews" :class="keyName"></div>
		</div>

		<div class="column is-12-mobile is-12-tablet is-12-desktop" :class="canUpload ? 'is-12-widescreen' : 'is-8-widescreen'">
			<dropzone v-show="canUpload" :id="keyName + 'Dropzone'" ref="dropzone"
			:options="optionMerge(keyName)"
			@vdropzone-mounted="dzLoad(value, keyName)"
			@vdropzone-success="dzSuccess($event, keyName)"
			@vdropzone-error="dzError($event, keyName)"
			@vdropzone-max-files-exceeded="dzMaxFiles($event, keyName)"
			:destroyDropzone="true"
			/>

			<template v-if="!canUpload">
				<div @click="clicker()" class="button is-warning v-padding">
					<b-icon icon="reload" class="margin-right-small mdi-for-button" /> {{button || 'Change file'}}
				</div>

				<!-- <div @click="deleter()" class="button is-danger margin-left v-padding">
					<b-icon icon="delete" class="margin-right-small" /> Remove
				</div> -->
			</template>

			<div v-if="changedFile" @click="canceler()" class="button is-info v-padding" :class="canUpload ? '' : 'margin-left'">
				<b-icon icon="close-circle" class="margin-right-small mdi-for-button" /> Cancel
			</div>
		</div>
	</div>
</template>

<style lang="css">
@import url('~/node_modules/vue2-dropzone/dist/vue2Dropzone.css');
</style>

<script>
import Vue from 'vue'

import Dropzone from 'nuxt-dropzone'
import Toast from '../utils/buefy-toasts.js'

export default {
	data () {
		return {
			canUpload: false,
			changedFile: false
		}
	},
	props: {
		keyName: { default: null },
		value: { default: null },
		button: { default: '' },
		options: { default: function () { return {} } }
	},
	components: { Dropzone },
	mounted () {
		// console.log(this.$refs.dropzone.$el.click)
	},
	methods: {
		clicker () { this.$refs.dropzone.$el.click() },
		deleter () {
			this.dzDelete()
			this.$emit('input', null)
			this.canUpload = true
		},
		canceler () {
			this.dzDelete()
			this.dzLoad(this.value, this.keyName)
			this.$emit('cancel', new File([''], 'filename'))
			this.changedFile = false
		},
		optionMerge (keyName) {
			let addDefaults = { previewsContainer: '.dropzone-previews.' + keyName }
			return Object.assign(this.options, addDefaults)
		},
		dzLoad (url, keyName) {
			this.canUpload = true
			document.querySelector('#' + keyName + 'Dropzone .dz-default').classList.add('flex-vcenter')

			if (url) {
				this.canUpload = false
				url = this.$store.state.api.base + url.medium

				fetch(url, { mode: 'no-cors' }).then(res => {
					let blob = res.blob()
					let file = new File([blob], keyName)
					this.$refs['dropzone'].manuallyAddFile(file, url)

					this.$nextTick(a => { this.customPreview(url, keyName) })
				})
			}
		},
		dzMaxFiles (file, keyName) {
			this.dzDelete()
			this.$nextTick(a => { if (this.$refs['dropzone'] && file) this.dzSuccess(file, keyName) })
		},
		dzDelete () {
			this.canUpload = true
			this.$refs['dropzone'].removeAllFiles()
		},
		dzSuccess (file, keyName) {
			this.canUpload = false
			this.$refs['dropzone'].removeAllFiles()
			this.$refs['dropzone'].manuallyAddFile(file)

			this.$emit('input', file)
			this.changedFile = true
			setTimeout(a => { this.customPreview(file.dataURL || '', keyName) }, 100)
		},
		dzError (file, keyName) {
			let ext = '.' + file.name.split('.').pop()
			let acceptedExts = this.options.acceptedFiles.split(',')
			let isAccepted = acceptedExts.indexOf(ext) >= 0

			let errorSpan = document.querySelector('.dropzone-previews.' + keyName + ' span[data-dz-errormessage]')

			let dzErrorMsg = errorSpan ? errorSpan.innerHTML ? errorSpan.innerHTML : 'Error: File not valid' : 'Error: File not valid'
			if (!isAccepted) Toast.open({ duration: this.$store.state.toast.duration, message: dzErrorMsg, position: 'is-bottom', type: 'is-danger' })
			this.$refs['dropzone'].removeFile(file)
		},
		customPreview (url, keyName) {
			let dzImage = document.querySelector('.dropzone-previews.' + keyName + ' .dz-image')

			if (dzImage) {
				let bgImg = url

				var link = document.createElement('a')
				link.innerHTML = dzImage.innerHTML
				link.setAttribute('class', 'dz-image')
				link.setAttribute('href', url)
				link.setAttribute('target', '_blank')

				dzImage.parentNode.replaceChild(link, dzImage)

				if (!url.endsWith('.jpg') && !url.endsWith('.jpeg') && !url.endsWith('.png') && !url.startsWith('data:image')) bgImg = '/img/placeholders/file.png'

				link.style.backgroundImage = 'url(' + bgImg + ')'
			}
		}
	}
}
</script>
