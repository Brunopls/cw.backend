const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PropertiesFeaturesSchema = new Schema({
	title: {
		type: String,
		required: 'title required.',
	}
})

const PropertiesFeatures = mongoose.model('PropertiesFeatures', PropertiesFeaturesSchema)
module.exports = PropertiesFeatures
