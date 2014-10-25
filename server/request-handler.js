var request = require('request');
var Firebase = require('firebase');
var Promise = require('bluebird');
var Events = require('minivents');
var _ = require('underscore');
var sentiment = require('Sentimental').analyze;

var getSentiment = function(string){
  if(!string || string === undefined){return 'Neutral'}
  var sent = sentiment(string).score;
  if(sent > 0){
    if(sent >= 0 && sent < 3){
      return "Positive";
    } else if(sent >= 3 && sent < 6){
      return "Positive";
    } else if(sent >= 6 && sent < 9){
      return "Quite Positive";
    } else if(sent >= 9 && sent < 12){
      return "Very Positive";
    } else if(sent >= 12 && sent < 15){
      return "Extremely Positive";
    } else if(sent >= 15){
      return "Incredibly Positive";
    }
  } else if (sent < 0) {
    if(sent < 0 && sent > -3){
      return "Negative";
    } else if(sent <= -3 && sent > -6){
      return "Quite Negative";
    } else if(sent <= -6 && sent > -9){
      return "Very Negative";
    } else if(sent <= -9 && sent > -12){
      return "Extremely Negative";
    } else if(sent <= -12){
      return "Incredibly Negative";
    }
  } else if(sent === 0) {
      return "Neutral";
  };
};

exports.getTopStories = function(req, res, next){
  var today = new Date().getTime();
  var yesterday = Math.floor((today - 86400000)/1000);

  request('https://hn.algolia.com/api/v1/search?tags=story&hitsPerPage=60&numericFilters=created_at_i>'+ yesterday, function(err,response, stories){
    var storiesArr = JSON.parse(stories).hits;
    var parsedArr = [];
    var string = "";

    for (var i = 0; i < storiesArr.length; i++) {
      var neededData = {
        title: storiesArr[i].title,
        id: storiesArr[i].objectID,
        url: storiesArr[i].url,
        points: storiesArr[i].points,
        num_comments: storiesArr[i].num_comments,
        created_at_i: storiesArr[i].created_at_i,
        author: storiesArr[i].author,
        storyText: storiesArr[i].storyText,
        sentiment: getSentiment(storiesArr[i].title)
      };
      parsedArr.push(neededData);
      string += storiesArr[i].storyText + storiesArr[i].title;


    };
    var highFrequency = countWords(string).slice(0, 15)
    var returnObj = {
      storiesArr : parsedArr,
      highFrequency : highFrequency,
      sentiment : getSentiment(string)
    };
    res.send(returnObj);
  });
};

exports.getUserInfo = function(req, res, next){
  request('https://hn.algolia.com/api/v1/users/'+ req.params.userId, function(err, response, user){
    if(err) throw err
    if(response.statusCode !== 404){
      var basic = JSON.parse(user);
      var userObj = {
        comments: basic.comment_count,
        stories: basic.submission_count,
        basic: basic
      };
      res.send(userObj);
    } else {
      res.status(404).end()
      return;
    }
  });
}

var reduceDataPts = function (array, labels){

  // start array with zero at index 0
  // loop through array find the first value greater than 0 and trim the array at that index
  var trimmedArr;
  var trimmedLabels;
  var peak = 0;
  var zeroCount = 0
  var zeroStart = null;
  for (var i = 0; i < array.length; i++) {
    if(array[i] > 0){
      peak=array[i];
    }
    if(array[i] > 0 && peak !== null) {
      trimmedArr = array.slice(i-1, array.length);
      trimmedLabels = labels.slice(i-1, array.length);
      break
    }
  };
  for (var i = 0; i < trimmedArr.length; i++) {
    if(peak > 0){
      if(trimmedArr[i] !== 0){
        zeroCount = 0;
        zeroStart = null;

      } else {
        zeroCount++
        if(zeroCount === 1){
          zeroStart = i
        }
      }
      if(zeroCount >= 5){
        trimmedArr = trimmedArr.slice(0, zeroStart)
        trimmedLabels = trimmedLabels.slice(0, zeroStart);

        return {arr: trimmedArr, labels: trimmedLabels}
      }
    }
  };
}
var getArticleComments = function (storyId, cb){
   request('https://hn.algolia.com/api/v1/search?hitsPerPage=500&tags=comment,story_'+storyId, function(err, resStorCom, storyComments){
      if(err) throw err;
      if(resStorCom.statusCode === 404){
        res.status(404).end();
        return;
      }      
      var results = JSON.parse(storyComments).hits;
      var byDay = {};
      var string = ""
      for (var i = 0; i < results.length; i++) {
        string += results[i].comment_text;
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
          return -1;
        } else if (a.day === b.day){
          return 0;
        } else{
          return 1;
        }
      }).sort(function(a,b){
        if(a.month < b.month){
          return -1;
        } else if (a.month === b.month){
          return 0;
        } else{
          return 1;
        }
      }).sort(function(a,b){
        if(a.year < b.year){
          return -1;
        } else if (a.year === b.year){
          return 0;
        } else{
          return 1;
        }
      });
      var statArr = [];
      var labels = [];

      flattenedArray.forEach(function(day){
        for (var i = 0; i < 24; i++) {
          if(day[i]){
            labels.push((day.month+1) + "/" + day.day + " " + i + ":00")
            statArr.push(day[i]);
          } else {
            labels.push((day.month+1) + "/" + day.day + " " + i + ":00")
            statArr.push(0);
          }
        };
      });
      var sent = getSentiment(string)
      var trimmed = reduceDataPts(statArr, labels)
      var commentsObj = {
        labels: trimmed.labels,
        commentArr: trimmed.arr,
        sentiment: sent,
      };
      cb(commentsObj);
    });

}
exports.getArticleComments = function(req, res, next){

  var id = req.params.articleId;
  request('https://hn.algolia.com/api/v1/search?hitsPerPage=500&tags=story,author_'+req.params.userId, function(err,response,stories){


    });
  getArticleComment(id, function(commentsObj){
      var topPostObj = {
        postObj: topStory,
        labels: commentsObj.labels,
        commentArr: commentsObj.commentArr
      };
      res.send(topPostObj);
    }); 
}

exports.getPost = function(req, res, next){
  request('https://hn.algolia.com/api/v1/search?hitsPerPage=1&tags=story,story_'+req.params.storyId, function(err, resStorCom, story){
    var postObj = JSON.parse(story).hits
    getArticleComments(req.params.storyId, function(commentsObj){
      var PostObj = {
        postObj: postObj,
        labels: commentsObj.labels,
        sentiment: commentsObj.sentiment,
        commentArr: commentsObj.commentArr
      };
      res.send(PostObj);
    }); 
  });
};

exports.getTopPost = function(req, res, next){
  request('https://hn.algolia.com/api/v1/search?hitsPerPage=500&tags=story,author_'+req.params.userId, function(err,response,stories){
    
    if(err) throw err;
    if(response.statusCode === 404){
      res.status(404).end();
      return;
    }
    var topScore = 0;
    var topStory;
    var stories = JSON.parse(stories).hits;
    stories.forEach(function(story){
      if(story.points > topScore){
        topScore = story.points + story.num_comments;
        topStory = story;
      }
    });
    if(!topStory){
      res.status(404).end();
      return;
    }
    getArticleComments(parseInt(topStory.objectID), function(commentsObj){
      var topPostObj = {
        postObj: topStory,
        labels: commentsObj.labels,
        sentiment: commentsObj.sentiment,
        commentArr: commentsObj.commentArr
      };
      res.send(topPostObj);
    }); 
  });
};
exports.getLastPost = function(req, res, next){
  request('https://hn.algolia.com/api/v1/search_by_date?hitsPerPage=1&tags=story,author_'+req.params.userId, function(err, response, body){
    if(err) throw err;
    if(response.statusCode === 404){
      res.status(404).end()
      return
    }    
    var latestStory = JSON.parse(body).hits[0];
    if(!latestStory){
      res.status(404).end()
      return
    }
    getArticleComments(parseInt(latestStory.objectID), function(commentsObj){
      var lastPostObj = {
        postObj: latestStory,
        labels: commentsObj.labels,
        sentiment: commentsObj.sentiment,
        commentArr: commentsObj.commentArr
      };
      res.send(lastPostObj);
    });
  });
};

var getTwoMonthComparison = function(user){
  var today = new Date().getTime();
  var oneMonthAgo = Math.floor((today - 25920000000)/1000);
  var twoMonthsAgo = Math.floor((today - (25920000000 * 2))/1000);
  request('https://hn.algolia.com/api/v1/search_by_date?tags=(story, comments)&numericFilters=created_at_i>' + oneMonthAgo + ',created_at_i<' + today + '&author='+user, function(err, response, thisMonth){
    request('https://hn.algolia.com/api/v1/search_by_date?tags=(story, comments)&numericFilters=created_at_i>' + twoMonthsAgo + ',created_at_i<' + oneMonthAgo + '&author='+user, function(err, response, lastMonth){
      var thisMonthCount = thisMonth.length
      var lastMonthCount = lastMonth.length
      var diff = (thisMonthCount - lastMonthCount) / lastMonthCount
      // res.send({
      //   thisMonth: thisMonthCount,
      //   lastMonth: lastMonthCount,
      //   diff: diff
      // });
    });
  });
};

exports.getTwoWeekComparison = function(req, res, next){

}

exports.getTwoQuarterComparison = function(req, res, next){


}

exports.getHourlyAverages = function(req, res, next){
  request('https://hn.algolia.com/api/v1/search?hitsPerPage=500&tags=(story,comments),author_'+req.params.userId, function(err,response,subs){
    if(err) throw err;    
    if(response.statusCode === 404){
      res.send(404)
      return 
    }  
    var submissions = JSON.parse(subs).hits;
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
  });
};

var countWords = function(text){
 
  var sWords = text.toLowerCase().trim().replace(/[,;.]/g,'').split(/[\s\/]+/g).sort();
  var iWordsCount = sWords.length; // count w/ duplicates
 
  // array of words to ignore
  var ignore = ['and','the','to','hn:', 'by', 'you', 'your', '–', 'at', 'do','have', 'or','a','of','for','as','i','with','it','is','on','that','this','can','in','be','has','if'];
  ignore = (function(){
    var o = {}; // object prop checking > in array checking
    var iCount = ignore.length;
    for (var i=0;i<iCount;i++){
      o[ignore[i]] = true;
    }
    return o;
  }());
 
  var counts = {}; // object for math
  for (var i=0; i<iWordsCount; i++) {
    var sWord = sWords[i];
    if (!ignore[sWord]) {
      counts[sWord] = counts[sWord] || 0;
      counts[sWord]++;
    }
  }
 
  var arr = []; // an array of objects to return
  for (sWord in counts) {
    arr.push({
      text: sWord,
      frequency: counts[sWord]
    });
  }
 
  // sort array by descending frequency | http://stackoverflow.com/a/8837505
  return arr.sort(function(a,b){
    return (a.frequency > b.frequency) ? -1 : ((a.frequency < b.frequency) ? 1 : 0);
  });
};
