define(function (require) {
    'use strict';

    require('angular-mocks');

    require('am-localization');
    var angular = require('angular');

    var module = angular.module('demo', ['am.localization', 'ngMockE2E'])
        .controller('demoCtrl', function ($scope, amLocalizationService) {
            $scope.englishText = amLocalizationService.gettext('test', 'en_US').fetch('one', 'two');
            $scope.englishTextPlural = amLocalizationService.gettext('test', 'en_US').ifPlural(2).fetch('one', 'two');
            $scope.japaneseText = amLocalizationService.gettext('test', 'jp').fetch('一','二');
            $scope.unknownText = amLocalizationService.gettext('unknown', 'jp').fetch();
        });

    module.run(function ($httpBackend) {
//        Setup fake backend results here.
//        $httpBackend.whenPOST() etc..
        $httpBackend.when('GET', '/i18n/', undefined,
            {
                'Accept': 'application/json, text/plain, */*',
                'accept-language': 'en_US'
            }).respond(200, {
                'messages': {
                    '': {
                        'plural_forms': 'nplurals=3; plural=(n != 1);'
                    },
                    'test': [
                        'plural',
                        'I like the %1$s %2$s.',
                        'I like the plural %1$s %2$s.'
                    ]
                }
            }
        );
        $httpBackend.when('GET', '/i18n/', undefined,
            {
                'Accept': 'application/json, text/plain, */*',
                'accept-language': 'jp'
            }).respond(200, {
                'messages': {
                    '': {
                    },
                    'test': [
                        null,
                        '私が好きい%1$s%2$s.'
                    ]
                }
            }
        );
    });

    angular.bootstrap(document, ['demo']);

});


