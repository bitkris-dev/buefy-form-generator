<template>
	<div class="columns is-multiline" v-if="mounted">
		<div class="column is-12-mobile is-12-tablet is-12-desktop" v-show="!canUpload" :class="canUpload ? 'is-4-widescreen' : 'is-12-widescreen'">
			<div class="dropzone-previews" :class="keyName"></div>
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
				<div @click="clicker()" class="button is-warning">
					<b-icon icon="reload" class="margin-right-small mdi-for-button" /> {{button || 'Change file'}}
				</div>

				<!-- <div @click="deleter()" class="button is-danger margin-left">
					<b-icon icon="delete" class="margin-right-small" /> Remove
				</div> -->
			</template>

			<div v-if="changedFile" @click="canceler()" class="button is-info" :class="canUpload ? '' : 'margin-left'">
				<b-icon icon="close-circle" class="margin-right-small mdi-for-button" /> Cancel
			</div>
		</div>
	</div>
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import Toast from '../utils/buefy-toasts.js'
import startsWith from 'lodash/startsWith'
import endsWith from 'lodash/endsWith'

const downloadBox = '<br><svg class="svg-grey-dark" style="margin-bottom:5px;transform:rotate(180deg)" width="30" height="20" viewBox="0 0 20 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>upload-box-2</title><g id="Canvas" transform="translate(-10520 -3883)"><g id="upload-box-2"><g id="Vector"><use xlink:href="#path0_stroke" transform="matrix(-1 -1.22465e-16 1.22465e-16 -1 10539 3898)" fill="#222222"/></g><g id="Vector"><use xlink:href="#path1_stroke" transform="matrix(-1 -1.22465e-16 1.22465e-16 -1 10534 3893.94)" fill="#222222"/></g></g></g><defs><path id="path0_stroke" d="M -1 2.70968C -1 3.26196 -0.552285 3.70968 0 3.70968C 0.552285 3.70968 1 3.26196 1 2.70968L -1 2.70968ZM 0 0L 0 -1C -0.552285 -1 -1 -0.552285 -1 2.22045e-16L 0 0ZM 18 0L 19 0C 19 -0.552285 18.5523 -1 18 -1L 18 0ZM 17 2.70968C 17 3.26196 17.4477 3.70968 18 3.70968C 18.5523 3.70968 19 3.26196 19 2.70968L 17 2.70968ZM 1 2.70968L 1 0L -1 0L -1 2.70968L 1 2.70968ZM 0 1L 18 1L 18 -1L 0 -1L 0 1ZM 17 0L 17 2.70968L 19 2.70968L 19 0L 17 0Z"/><path id="path1_stroke" d="M 3.05 9.93548C 3.05 10.4878 3.49772 10.9355 4.05 10.9355C 4.60228 10.9355 5.05 10.4878 5.05 9.93548L 3.05 9.93548ZM 4.05 0L 4.75837 -0.705841C 4.57073 -0.894151 4.31584 -1 4.05 -1C 3.78416 -1 3.52927 -0.894151 3.34163 -0.705841L 4.05 0ZM 7.39163 4.77036C 7.78146 5.16158 8.41462 5.16271 8.80584 4.77289C 9.19706 4.38306 9.1982 3.7499 8.80837 3.35868L 7.39163 4.77036ZM -0.708371 3.35868C -1.0982 3.7499 -1.09706 4.38306 -0.705841 4.77289C -0.314618 5.16271 0.318546 5.16158 0.708371 4.77036L -0.708371 3.35868ZM 5.05 9.93548L 5.05 0L 3.05 0L 3.05 9.93548L 5.05 9.93548ZM 3.34163 0.705841L 7.39163 4.77036L 8.80837 3.35868L 4.75837 -0.705841L 3.34163 0.705841ZM 3.34163 -0.705841L -0.708371 3.35868L 0.708371 4.77036L 4.75837 0.705841L 3.34163 -0.705841Z"/></defs></svg>'

export default {
	name: 'dropzone-wrap',
	data () {
		return {
			mounted: false,
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
		this.mounted = true
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
			let options = Object.assign(this.options, addDefaults)
			if (!startsWith(options.dictDefaultMessage, downloadBox)) options.dictDefaultMessage = downloadBox + '<br>' + (options.dictDefaultMessage || 'Drop files here to upload')
			return options
		},
		dzLoad (url, keyName) {
			this.canUpload = true
			let file = new File([""], keyName)

			if (url) {
				this.canUpload = false

				fetch(url, { mode: 'no-cors' }).then(res => {
					let blob = res.blob()
					let file = new File([blob], keyName)
					this.$refs['dropzone'].manuallyAddFile(file, url)

					this.$nextTick(() => { this.customPreview(url, keyName) })
				})
			} else this.$refs['dropzone'].manuallyAddFile(file, null)
		},
		dzMaxFiles (file, keyName) {
			this.dzDelete()
			this.$nextTick(() => { if (this.$refs['dropzone'] && file) this.dzSuccess(file, keyName) })
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
			setTimeout(() => { this.customPreview(file.dataURL || '', keyName) }, 100)
		},
		dzError (file, keyName) {
			let ext = '.' + file.name.split('.').pop()
			let acceptedExts = this.options.acceptedFiles.split(',')
			let isAccepted = acceptedExts.indexOf(ext) >= 0

			let errorSpan = document.querySelector('.dropzone-previews.' + keyName + ' span[data-dz-errormessage]')

			let dzErrorMsg = errorSpan ? errorSpan.innerHTML ? errorSpan.innerHTML : 'Error: File not valid' : 'Error: File not valid'
			if (!isAccepted) Toast.open({ duration: 3000, message: dzErrorMsg, position: 'is-bottom', type: 'is-danger' })
			this.$refs['dropzone'].removeFile(file)
		},
		customPreview (url, keyName) {
			let dzImage = document.querySelector('.dropzone-previews.' + keyName + ' .dz-image')

			if (dzImage && url) {
				let bgImg = url

				var link = document.createElement('a')
				link.innerHTML = dzImage.innerHTML
				link.setAttribute('class', 'dz-image')
				link.setAttribute('href', url)
				link.setAttribute('target', '_blank')

				dzImage.parentNode.replaceChild(link, dzImage)

				if (!endsWith(url, '.jpg') && !endsWith(url, '.jpeg') && !endsWith(url, '.png') && !startsWith(url, 'data:image')) bgImg = '/img/placeholders/file.png'

				link.style.backgroundImage = 'url(' + bgImg + ')'
			}
		}
	}
}
</script>
