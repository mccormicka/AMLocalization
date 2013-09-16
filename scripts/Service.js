define(function (require) {
    'use strict';

    var Jed = require('jed');
    var _ = require('lodash');

    function Service($http, $q, $rootScope) {

        var languages = {};
        var loadingLanguages = {};

        function createDefer() {
            var defer = $q.defer();
            var promise = defer.promise;
            promise.ifPlural = function () {
                this.plural = true;
                this.pluralValues = [].slice.call(arguments);
                return promise;
            };

            promise.fetch = function () {
                this.fetched = true;
                this.fetchedValues = [].slice.call(arguments);
                return promise;
            };
            return defer;
        }

        function resolveDefer(key, lang, defer) {
            var translation = translatedKey(key, lang);
            if (defer.promise.plural) {
                translation = translation.ifPlural.apply(translation, defer.promise.pluralValues);
            }
            if (defer.promise.fetched) {
                translation = translation.fetch(defer.promise.fetchedValues);
            }
            defer.resolve(translation);
        }

        function remoteTranslation(key, lang, endpoint) {

            var defer = createDefer();

            var params = {
                method: 'GET',
                url: endpoint
            };
            //If explicitly set then force the language otherwise
            //let the server side decide based on the users browser
            //settings.
            if (lang !== '__default__') {
                params.headers = {'accept-language': lang};
            }
            if(!loadingLanguages[lang]){
                loadingLanguages[lang] = [];
                $http(params)
                    .success(function (data) {
                        languages[lang] = new Jed({
                            'locale_data': data
                        });
                        resolveDefer(key, lang, defer);
                        _.each(loadingLanguages[lang], function(item){
                            resolveDefer(item.key, item.lang, item.defer);
                        });
                        delete loadingLanguages[lang];
                    })
                    .error(function (data) {
                        console.log('Error', data);
                    });
            }else{
                loadingLanguages[lang].push({key:key, lang:lang, defer:defer});
            }

            return defer.promise;
        }

        function translatedKey(key, lang) {
            return languages[lang].translate(key);
        }

        return {
            /**
             * Default endpoint to hit for translations
             */
            endpoint:'/i18n/',

            gettext: function (key, lang) {
                lang = lang || '__default__';
                if (!languages[lang]) {
                    return remoteTranslation(key, lang, this.endpoint);
                }
                //Create our fake defer and resolve on the next tick.
                var defer = createDefer();
                $rootScope.$evalAsync(function(){
                    resolveDefer(key, lang, defer);
                });

                return defer.promise;
            }
        };
    }

    Service.$inject = ['$http', '$q', '$rootScope'];
    return Service;
});


