'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Course = mongoose.model('Course'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Course
 */
exports.create = function (req, res) {
  var course = new Course(req.body);
  course.user = req.user;

  course.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(course);
    }
  });
};

/**
 * Show the current Course
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var course = req.course ? req.course.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  course.isCurrentUserOwner = req.user && course.user && course.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(course);
};

/**
 * Update a Course
 */
exports.update = function (req, res) {
  var course = req.course;

  course = _.extend(course, req.body);

  course.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(course);
    }
  });
};

/**
 * Delete an Course
 */
exports.delete = function (req, res) {
  var course = req.course;

  course.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(course);
    }
  });
};

/**
 * List of Courses
 */
exports.list = function (req, res) {
  Course.find().sort('-created').populate('user', 'displayName').exec(function (err, courses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(courses);
    }
  });
};

/**
 * Course middleware
 */
exports.courseByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Course is invalid'
    });
  }

  Course.findById(id).populate('user', 'displayName').exec(function (err, course) {
    if (err) {
      return next(err);
    } else if (!course) {
      return res.status(404).send({
        message: 'No Course with that identifier has been found'
      });
    }
    req.course = course;
    next();
  });
};

exports.addPoints = function (req, res) {
  var lessonResults = req.body.results;
  var lessonId = lessonResults._id;

  var currentCourse = req.course;
  var points = 0;
  for (var question of lessonResults.questions) {
    points += question.points || 0;
  }

  req.user.populate('startedCourses');
  var userCourses = req.user.startedCourses;

  if (userCourses.findIndex(function (val) {
    return val.course.equals(currentCourse._id);
  }) === -1) {
    userCourses.push({ course: currentCourse._id, finishedLessons: [] });
    req.user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
  }

  var currentUserCourse = userCourses.find(function (val) {
    return val.course.equals(currentCourse._id);
  });

  var currentUserLesson = currentUserCourse.finishedLessons.find(function (val) {
    return val.id === lessonId;
  });

  if (!currentUserLesson) {
    currentUserCourse.finishedLessons.push({
      id: lessonId,
      points: points
    });
  } else {
    currentUserLesson.points = Math.max(currentUserLesson.points, points);
  }

  req.user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  });

};
