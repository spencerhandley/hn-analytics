angular.module('hnlyticsApp')
  .controller('TopListCtrl', ['$scope', 'topStories', function ($scope, topStories) {
      $scope.topStories = topStories.storiesArr
      $scope.dgntData = [ 
        { label: topStories.highFrequency[0].text,
          value: topStories.highFrequency[0].frequency,
          color:"#F7464A"
        },
        { label: topStories.highFrequency[1].text,
          value: topStories.highFrequency[1].frequency,
          color:"#F7464A"
        },
        { label: topStories.highFrequency[2].text,
          value: topStories.highFrequency[2].frequency,
          color:"#F7464A"
        },
        { label: topStories.highFrequency[3].text,
          value: topStories.highFrequency[3].frequency,
          color:"#F7464A"
        },
        { label: topStories.highFrequency[4].text,
          value: topStories.highFrequency[4].frequency,
          color:"#E2EAE9"
        },
        { label: topStories.highFrequency[5].text,
          value: topStories.highFrequency[5].frequency,
          color:"#D4CCC5"
        },
        { label: topStories.highFrequency[6].text,
          value: topStories.highFrequency[6].frequency,
          color:"#D4CCC5"
        },
        { label: topStories.highFrequency[7].text,
          value: topStories.highFrequency[7].frequency,
          color:"#949FB1"
        },
        { label: topStories.highFrequency[8].text,
          value: topStories.highFrequency[8].frequency,
          color:"#949FB1"
        },
        { label: topStories.highFrequency[9].text,
          value: topStories.highFrequency[9].frequency,
          color:"#4D5360"
        },
        { label: topStories.highFrequency[10].text,
          value: topStories.highFrequency[10].frequency,
          color:"#4D5360"
        },

        ];

  }]);
