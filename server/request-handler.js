var request = require('request');
var Firebase = require("firebase");
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Events = require('minivents');

// var _ = require('underscore')
// var util = require('../lib/utility');

var User = require('./api/users/user');
var Story = require('./api/stories/story');
// var Poll = require('./mongoose/models/poll');
var Comment = require('./api/comments/comment');
// var Pollopt = require('./mongoose/models/pollopt');
// var Job = require('./mongoose/models/job');
var ref = new Firebase("https://hacker-news.firebaseio.com/v0/");
var users = ref.child('user');
var maxRef = ref.child('maxitem')

// var updateUser = function(username){
//   users.child(username).once('value', function(user){
//   })
// }
// exports.syncUsers = function(req, res, next){

//   Comment.find({}, function(err, comment){
//     var users = []
//     for (var i = 0; i < comment.length; i++) {
//       users.push(comment[i].by)
//     };
//     res.send(_.unique(users))
//   })
// }
exports.getLastPostComments = function(req, res, next){
  request('https://hn.algolia.com/api/v1/search_by_date?hitsPerPage=1&tags=story,author_'+req.params.userId, function(err, res, body){
    var topStory = JSON.parse(body).hits;
    request('https://hn.algolia.com/api/v1/search?hitsPerPage=500&tags=comment,story_'+parseInt(topStory[0].objectID), function(err, res, storyComments){
      var results = JSON.parse(storyComments);
      var byDay = {};
      for (var i = 0; i < results.length; i++) {
        if(results[i].time){
          var date = new Date(results[i].created_at_i*1000);
          var day = date.getDate();
          var hours = date.getHours();
          if(byDay[day]){
            if(byDay[day][hours]){
              byDay[day][hours]++;
            } else {
              byDay[day][hours] = 1;
              console.log(byDay[day])
            }
          } else {
            byDay[day] = {day:day};
            byDay[day][hours] = 1;
          }
        }
      };
      var lastPostObj = {
        postObj: results
        commentArr: byDay
      };
      res.send(lastPostObj);
    });
  });
};
exports.getHourlyAverages = function(req, res, next){
  request('https://hn.algolia.com/api/v1/search?hitsPerPage=500&tags=story,author_'+req.params.userId, function(err,response,stories){
    request('https://hn.algolia.com/api/v1/search?hitsPerPage=500&tags=comment,author_'+req.params.userId, function(err,response,comments){
      var usersStories = JSON.parse(stories);
      var usersComments = JSON.parse(comments);
      var submissions = usersComments.hits.concat(usersStories.hits)
      var timesOfTheDay = {};
      var averageTimes = submissions
        .map(function(sub) {
          var subTime = new Date(sub.created_at_i*1000);
          return subTime.getHours();
        })
        .reduce(function(last, now) {
          var index = last[0].indexOf(now);
          if (index === -1) {
            last[0].push(now);
            last[1].push(1);
          } else {
            last[1][index] += 1;
          }
          return last;
        }, [[], []])
        .reduce(function(last, now, index, context) {
          var zip = [];
          last.forEach(function(word, i) {
            zip.push([word, context[1][i]]);
          });
          return zip;
        });
        for (var i = 0; i < averageTimes.length; i++) {
            timesOfTheDay[averageTimes[i][0]]= averageTimes[i][1];
        };
        console.log(timesOfTheDay)
    });
  });
};


