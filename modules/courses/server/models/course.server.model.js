'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Course Schema
 */
var CourseSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: 'Please fill Course name',
    trim: true
  },
  categories: [{
    name: String,
    chapters: [{
      name: String,
      lesons: [{
        name: String,
        question: String,
        answers: [String]
      }]
    }]
  }],
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Course', CourseSchema);
