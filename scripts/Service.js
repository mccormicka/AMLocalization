define(function (require) {
    'use strict';

    var Jed = require('jed');

    function Service($http, $q) {

        var languages = {};

        function remoteTranslation(key, lang, endpoint) {
            var defer = $q.defer();
            var promise = defer.promise;
            var plural;
            var pluralValues;
            promise.ifPlural = function () {
                plural = true;
                pluralValues = [].slice.call(arguments);
                return promise;
            };

            var fetched;
            var fetchedValues;
            promise.fetch = function () {
                fetched = true;
                fetchedValues = [].slice.call(arguments);
                return promise;
            };

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

            $http(params)
                .success(function (data) {
                    languages[lang] = new Jed({
                        'locale_data': data
                    });
                    var translation = translatedKey(key, lang);
                    if (plural) {
                        translation = translation.ifPlural.apply(translation, pluralValues);
                    }
                    if (fetched) {
                        translation = translation.fetch(fetchedValues);
                    }
                    defer.resolve(translation);
                })
                .error(function (data) {
                    console.log('Error', data);
                });

            return promise;
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
                return translatedKey(key, lang);
            }
        };
    }

    Service.$inject = ['$http', '$q'];
    return Service;
});


