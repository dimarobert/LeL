'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var uuid = require('node-uuid');

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
      icon: String,
      isSpacer: Boolean,
      lessons: [{
        _id: {
          type: String,
          default: function () { return uuid(); }
        },
        name: String,
        description: String,
        questions: [{
          type: {
            type: String,
            enum: ['choose-photo', 'translate']
          },
          caption: String,
          answers: [],
          solution: String
        }]
      }]
    }]
  }],
  created: {
    type: Date,
    default: Date.now
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Course', CourseSchema);
