export default {
	getSchema (DATA = {}) {
		const moment = require('../node_modules/moment')
		function dateGen (date) { return moment.utc(date).toDate() }

		return {
			schema: {
				text: {
					header: { icon: 'format-text', text: 'Texts' },
					appearance: { label: 'Text', icon: 'format-text', layout: 'column is-6' },
					data: { value: DATA.name || '', type: 'text', validate: 'required|min:3' }
				},
				textarea: {
					appearance: { label: 'Textarea', layout: 'column is-12' },
					data: { value: DATA.textarea || '', type: 'textarea', validate: 'required|min:3' }
				},
				richtext: {
					appearance: { label: 'Richtext', layout: 'column is-12' },
					data: { value: DATA.richtext || '', type: 'richtext', validate: 'required|min:3' }
				},
				html: {
					header: { icon: 'format-text', text: 'Custom HTML' },
					appearance: { label: 'HTML', layout: 'column is-12' },
					data: { html: '<b>This</b> is a <i>custom HTML</i>.', type: 'html' }
				},
				switch: {
					header: { icon: 'toggle-switch', text: 'Selectors' },
					appearance: { label: 'Switch', icon: 'format-text', layout: 'column is-3' },
					data: { value: DATA.switch ? 'Yes' : 'No', type: 'switch' }
				},
				checkbox: {
					appearance: { label: 'Checkbox', icon: 'format-text', layout: 'column is-3' },
					data: { value: DATA.checkbox ? 'Yes' : 'No', type: 'checkbox' }
				},
				select: {
					appearance: { label: 'Select', icon: 'format-text', layout: 'column is-12' },
					data: { value: DATA.select || null, type: 'select',
						options: [
							{ text: 'Option 1', value: 'option-1'},
							{ text: 'Option 2', value: 'option-2'},
							{ text: 'Option 3', value: 'option-3'}
						]
					}
				},
				date: {
					header: { icon: 'calendar-multiple', text: 'Date' },
					appearance: { label: 'Date', icon: 'calendar-clock', layout: 'column is-6' },
					data: { value: dateGen(DATA.date) || dateGen(new Date()), type: 'date' }
				},
				time: {
					header: { icon: 'calendar-multiple', text: 'Time' },
					appearance: { label: 'Time', icon: 'clock', layout: 'column is-6' },
					data: { value: null, type: 'time' }
				},
				image: {
					header: { icon: 'file-multiple', text: 'Files' },
					appearance: { label: 'Image', layout: 'column is-6' },
					data: {
						value: DATA.image ? DATA.image : '',
						type: 'dropzone',
						button: 'Change image',
						options: {
							maxFiles: 1,
							url: '/',
							uploadMultiple: false,
							createImageThumbnails: true,
							acceptedFiles: '.jpg, .jpeg, .png'
						}
					}
				},
				image2: {
					appearance: { label: 'Image2', layout: 'column is-6' },
					data: {
						value: DATA.image2 ? DATA.image2 : '',
						type: 'dropzone',
						button: 'Change image2',
						options: {
							maxFiles: 1,
							url: '/',
							uploadMultiple: false,
							createImageThumbnails: true,
							acceptedFiles: '.jpg, .jpeg, .png'
						}
					}
				}
			}
		}
	}
}
