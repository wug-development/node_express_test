/**
 * Created by wu on 2018/2/22.
 */

const mongoose = require('mongoose');
const uSchema = require('../schemas/users');

module.exports = mongoose.model('user',uSchema);
