// Settings
angular.module('cosmic.controllers').controller('SettingsCtrl', function(AppConfig,$scope,cosmicDB,$cordovaToast, $ionicPopup,$localstorage, $cordovaStatusbar,$ionicPopup) {



      // $cordovaStatusbar.hide();

    $scope.$on('$ionicView.afterEnter', function() {
        if(window.StatusBar){
            // $cordovaStatusbar.overlaysWebView(false);
            console.log("1 cordovaStatusbar.styleHex = "+ AppConfig.StatusbarColor2);
            $cordovaStatusbar.styleHex(AppConfig.StatusbarColor2);
        }
    });
    $scope.ChangeColor = function(){
        if(window.StatusBar){
            // $cordovaStatusbar.overlaysWebView(false);
            console.log("2 cordovaStatusbar.styleHex = "+AppConfig.StatusbarColor1);
            $cordovaStatusbar.styleHex(AppConfig.StatusbarColor1);
        }       
    }

    $scope.isSearchingArtworks = false;
    $scope.isSearchingArtists = false;

    $scope.config = {showStatusBar : ($localstorage.get('showStatusBar','true') === 'true'), goToPlayer : ($localstorage.get('goToPlayer','true') === 'true')};
        // if(window.StatusBar){
        //     window.StatusBar.overlaysWebView(false);
        //     window.StatusBar.styleHex('#000000');
        // }  
    // Hide/show status bar
    $scope.toggleStatusBar = function(){
        $localstorage.set('showStatusBar',$scope.config.showStatusBar);
        if ($scope.config.showStatusBar) {
            $cordovaStatusbar.show();
        } else {
            $cordovaStatusbar.hide();
        }
    };
    // Go to player on play
    $scope.toggleGoToPlayer = function(){
        $localstorage.set('goToPlayer',$scope.config.goToPlayer);
    };

    // $scope.closeSetting =function(){
    //     if(window.StatusBar){
    //         window.StatusBar.overlaysWebView(false);
    //         window.StatusBar.styleHex('#AA1451');
    //     }  
    // }
    // Find missing album covers
    $scope.findMissingArtworks = function(){
        if ( ! $scope.isSearchingArtworks){
            $scope.downloadArtworks = function(albums){
                $scope.myPopup.close();
                $scope.myPopup=null;
                $scope.isSearchingArtworks = true;
                cosmicDB.downloadArtworks(albums).then(function(nbArtworks){
                    $scope.isSearchingArtworks = false;
                    $cordovaToast.showShortTop('Updated '+nbArtworks+' new album covers !');
                    console.log('Success itunes');
                },function(error){
                    console.log(error);
                    $scope.isSearchingArtworks = false;
                });
            };
            $scope.myPopup = $ionicPopup.show({
                template: '<button class="button button-full button-positive" ng-click="downloadArtworks('+"'all'"+')">All</button>'+
                    '<button class="button button-full button-balanced" ng-click="downloadArtworks('+"'missing'"+')">Missing</button>',
                title: 'Update album covers',
                subTitle: '',
                scope: $scope,
                buttons: [
                    //{
                    //text: '<b>All</b>',
                    //type: 'button-positive',
                    //onTap: function(e){
                    //$scope.downloadArtworks('all');
                    //}
                    //},
                    //{
                    //text: '<b>Missings</b>',
                    //type: 'button-balanced',
                    //onTap: function(e){
                    //$scope.downloadArtworks('missing');
                    //}
                    //},
                    { text: 'Cancel',
                        onTap: function(e){
                            $scope.myPopup.close();
                        }
                    }
                ]
            });
        }
    };
    // Find artists names
    $scope.findArtistNames = function(){
        if ( ! $scope.isSearchingArtists){
            $scope.isSearchingArtists = true;
            cosmicDB.correctArtistNames().then(function(nbArtists){
                $scope.isSearchingArtists = false;
                $cordovaToast.showShortTop('Updated '+nbArtists+' names !');
                console.log('Success itunes');
            },function(error){
                console.log(error);
                $scope.isSearchingArtists = false;
            });
        }
    };

    // Clear Database
    $scope.clearAllDatabase = function(){

        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete all data',
            template: 'Are you sure ?',
            okText : 'Delete',
            okType : 'button-assertive'
        });
        confirmPopup.then(function(res) {
            if(res) {
                // Delete all data
                console.log('Clear database');
                cosmicDB.removeAllArtworks().then(function(){
                    console.log('Artworks removed');
                    cosmicDB.flushDatabase().then(function(){
                        console.log('Database cleared');
                        $localstorage.clear();
                        $cordovaToast.showShortTop('Database cleared !');
                    },function(err){
                        console.error(err);
                    });
                });
            } else {
            }
        });

    };


});


