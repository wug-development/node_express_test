/**
 * Created by wu on 2018/2/22.
 */

const mongoose = require('mongoose');
const uSchema = require('../schemas/category');

module.exports = mongoose.model('category',uSchema);