var request = require('request');
var Firebase = require('firebase');
var Promise = require('bluebird');
var Events = require('minivents');
var _ = require('underscore')


exports.getUserInfo = function(req, res, next){
  request('https://hn.algolia.com/api/v1/users/'+ req.params.userId, function(err, response, user){
    if(err) throw err
    if(response.statusCode !== 404){
      var basic = JSON.parse(user)
      var userObj = {
        comments: basic.comment_count,
        stories: basic.submission_count,
        basic: basic
      };
      console.log(userObj)
      res.send(userObj);
    } else {
      res.status(404).end()
      return
    }
  });
}
exports.getTopPost = function(req, res, next){
  request('https://hn.algolia.com/api/v1/search?hitsPerPage=500&tags=story,author_'+req.params.userId, function(err,response,stories){
    
    if(err) throw err
    if(response.statusCode === 404){
      res.status(404).end()
      return
    }
    var topScore = 0;
    var topStory;
    var stories = JSON.parse(stories).hits;
    stories.forEach(function(story){
      if(story.points > topScore){
        topScore = story.points + story.num_comments
        topStory = story
      }
    });
    if(!topStory){
      res.status(404).end()
      return
    }
    request('https://hn.algolia.com/api/v1/search?hitsPerPage=500&tags=comment,story_'+parseInt(topStory.objectID), function(err, resStorCom, storyComments){
      if(err) throw err
      if(resStorCom.statusCode === 404){
        res.status(404).end()
        return
      }
      var results = JSON.parse(storyComments).hits;
      var byDay = {};
      for (var i = 0; i < results.length; i++) {
        if(results[i].created_at_i){
          var date = new Date(results[i].created_at_i*1000);
          var day = date.getDate();
          var month = date.getMonth();
          var year = date.getFullYear();
          var hours = date.getHours();
          if(byDay[month + '/' + day + "/" + year]){
            if(byDay[month + '/' + day + "/" + year][hours]){
              byDay[month + '/' + day + "/" + year][hours]++;
            } else {
              byDay[month + '/' + day + "/" + year][hours] = 1;
            }
          } else {
            byDay[month + '/' + day + "/" + year] = {day:day, month: month, year: year};
            byDay[month + '/' + day + "/" + year][hours] = 1;
          }
        }
      };
      var flattenedArray = _.toArray(byDay).sort(function(a,b){
        if(a.day < b.day){
          return -1
        } else if (a.day === b.day){
          return 0
        } else{
          return 1
        }
      }).sort(function(a,b){
        if(a.month < b.month){
          return -1
        } else if (a.month === b.month){
          return 0
        } else{
          return 1
        }
      }).sort(function(a,b){
        if(a.year < b.year){
          return -1
        } else if (a.year === b.year){
          return 0
        } else{
          return 1
        }
      });
      var statArr = []
      var labels = []

      flattenedArray.forEach(function(day){
        for (var i = 0; i < 24; i++) {
          if(day[i]){
            labels.push(day.month + "/" + day.day + "/" + day.year + " " + i + ":00")
            statArr.push(day[i]);
          } else {
            labels.push(day.month + "/" + day.day + "/" + day.year + " " + i + ":00")
            statArr.push(0);
          }
        };
      });

      var topPostObj = {
        postObj: topStory,
        labels: labels,
        commentArr: statArr
      };
      res.send(topPostObj);
      console.log(topPostObj, "Sent DATA")
    }); 
  });
};
exports.getLastPost = function(req, res, next){
  request('https://hn.algolia.com/api/v1/search_by_date?hitsPerPage=1&tags=story,author_'+req.params.userId, function(err, response, body){
    if(err) throw err;
    console.log(response)
    if(response.statusCode === 404){
      res.status(404).end()
      return
    }    
    var latestStory = JSON.parse(body).hits[0];
    if(!latestStory){
      res.status(404).end()
      return
    }
    request('https://hn.algolia.com/api/v1/search?hitsPerPage=500&tags=comment,story_'+parseInt(latestStory.objectID), function(err, resStorCom, storyComments){
      if(err) throw err;
      if(resStorCom.statusCode === 404){
        res.status(404).end()
        return
      }      
      var results = JSON.parse(storyComments).hits;
      var byDay = {};
      for (var i = 0; i < results.length; i++) {
        if(results[i].created_at_i){
          var date = new Date(results[i].created_at_i*1000);
          var day = date.getDate();
          var month = date.getMonth();
          var year = date.getFullYear();
          var hours = date.getHours();
          if(byDay[month + '/' + day + "/" + year]){
            if(byDay[month + '/' + day + "/" + year][hours]){
              byDay[month + '/' + day + "/" + year][hours]++;
            } else {
              byDay[month + '/' + day + "/" + year][hours] = 1;
            }
          } else {
            byDay[month + '/' + day + "/" + year] = {day:day, month: month, year: year};
            byDay[month + '/' + day + "/" + year][hours] = 1;
          }
        }
      };
      var flattenedArray = _.toArray(byDay).sort(function(a,b){
        if(a.day < b.day){
          return -1
        } else if (a.day === b.day){
          return 0
        } else{
          return 1
        }
      }).sort(function(a,b){
        if(a.month < b.month){
          return -1
        } else if (a.month === b.month){
          return 0
        } else{
          return 1
        }
      }).sort(function(a,b){
        if(a.year < b.year){
          return -1
        } else if (a.year === b.year){
          return 0
        } else{
          return 1
        }
      });
      var statArr = []
      var labels = []

      flattenedArray.forEach(function(day){
        for (var i = 0; i < 24; i++) {
          if(day[i]){
            labels.push(day.month + "/" + day.day + "/" + day.year + " " + i + ":00")
            statArr.push(day[i]);
          } else {
            labels.push(day.month + "/" + day.day + "/" + day.year + " " + i + ":00")
            statArr.push(0);
          }
        };
      });
      var lastPostObj = {
        postObj: latestStory,
        labels: labels,
        commentArr: statArr
      };
      res.send(lastPostObj);
    });
  });
};
exports.getHourlyAverages = function(req, res, next){
  request('https://hn.algolia.com/api/v1/search?hitsPerPage=500&tags=(story,comments),author_'+req.params.userId, function(err,response,subs){
    if(err) throw err;    
    if(response.statusCode === 404){
      res.send(404)
      return 
    }  
    var submissions = JSON.parse(subs).hits;
    console.log(submissions)
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
      var timeArr = []
      for (var i = 0; i < 24; i++) {
        if(timesOfTheDay[i]){
          timeArr.push(timesOfTheDay[i]);
        }else{
          timeArr.push(0)
        }
      };
      res.send(timeArr);
      console.log(timeArr, "sent Data")
  });
};


