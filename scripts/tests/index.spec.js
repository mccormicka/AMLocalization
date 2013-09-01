define(function (require) {
    'use strict';

    require('angular-mocks');
    require('am-localization');

    describe('index tests', function () {

        describe('SHOULD', function () {
            var $http;
            var $httpBackend;
            var localizer;
            var rootScope;

            beforeEach(function () {
                module('am.localization');
                inject(function ($rootScope, $injector) {
                    rootScope = $rootScope;
                    $http = $injector.get('$http');
                    $httpBackend = $injector.get('$httpBackend');
                    localizer = $injector.get('amLocalizationService');
                });
            });

            it('Be able to inject localizer', function () {
                expect(localizer).toBeDefined();
            });

            it('Be able to translate the users default language', function () {
                //Set browser language to Japanese
                $http.defaults.headers.get = {'accept-language': 'jp'};
                $httpBackend.expectGET('/i18n/', {
                    'Accept': 'application/json, text/plain, */*',
                    'accept-language': 'jp'
                }).respond(200, japanese);
                var result = null;
                localizer.gettext('test').fetch('one', 'two').then(function (value) {
                    result = value;
                });
                $httpBackend.flush();
                $httpBackend.verifyNoOutstandingExpectation();
                expect(result).toBe('I like the one two Japanese');
            });

            it('Be able to translate the users specified language', function () {
                //Set browser language to Japanese
                $http.defaults.headers.get = {'accept-language': 'jp'};
                $httpBackend.expectGET('/i18n/', {
                    'Accept': 'application/json, text/plain, */*',
                    'accept-language': 'en_US'
                }).respond(200, english);
                var result = null;
                localizer.gettext('test', 'en_US').fetch('one', 'two').then(function (value) {
                    result = value;
                });
                $httpBackend.flush();
                $httpBackend.verifyNoOutstandingExpectation();
                expect(result).toBe('I like the one two English');
            });

            it('Be able to change the endpoint url', function () {
                $httpBackend.expectGET('/localizations/', {
                    'Accept': 'application/json, text/plain, */*',
                    'accept-language': 'en_US'
                }).respond(200, english);
                var result = null;
                localizer.endpoint = '/localizations/';
                localizer.gettext('test', 'en_US').fetch('one', 'two').then(function (value) {
                    result = value;
                });
                $httpBackend.flush();
                $httpBackend.verifyNoOutstandingExpectation();
                expect(result).toBe('I like the one two English');
            });

            it('Be able to pluralize text', function () {
                $httpBackend.expectGET('/localizations/', {
                    'Accept': 'application/json, text/plain, */*',
                    'accept-language': 'en_US'
                }).respond(200, english);
                var result = null;
                localizer.endpoint = '/localizations/';
                localizer.gettext('test', 'en_US').ifPlural(2).fetch('one', 'two').then(function (value) {
                    result = value;
                });
                $httpBackend.flush();
                $httpBackend.verifyNoOutstandingExpectation();
                expect(result).toBe('I like the plural two one English');
            });
        });
    });

    //-------------------------------------------------------------------------
    //
    // Private Methods
    //
    //-------------------------------------------------------------------------

    var english = {
        'messages': {
            '': {
                'plural_forms': 'nplurals=2; plural=(n != 1);'
            },
            'test': [
                null,
                'I like the %1$s %2$s English',
                'I like the plural %2$s %1$s English'
            ]
        }
    };

    var japanese = {
        'messages': {
            '': {
                'plural_forms': 'nplurals=3; plural=(n != 1);'
            },
            'test': [
                null,
                'I like the %1$s %2$s Japanese',
                'I like the plural %1$s %2$s Japanese'
            ]
        }
    };

});

//define(function (require) {
//    'use strict';
//
//    require('angular-mocks');
//    var Test = require('scripts/forgot/ForgotController');
//
//    var errorFormatter = require('scripts/util/ResponseFormatter');
//    var RedirectUtil = require('scripts/util/RedirectUtil');
//
//    describe('SHOULD', function () {
//
//        var $http;
//        var $httpBackend;
//        var $window;
//        var $location;
//        var scope;
//        var redirectUtil;
//
//        beforeEach(inject(function ($rootScope, $injector) {
//            scope = $rootScope.$new();
//            scope.registerRedirect = 'register';
//            scope.forgotRedirect = 'forgot';
//            scope.endpoint = '/forgot';
//            scope.email = 'forgot@forgot.com';
//            scope.successRedirect = 'application';
//            $http = $injector.get('$http');
//            $httpBackend = $injector.get('$httpBackend');
//            $location = $injector.get('$location');
//            $window = {
//                location: {
//                    href: ''
//                }
//            };
//            redirectUtil = new RedirectUtil($location);
//
//        }));
//
//        it('Post email to the server on submit', function () {
//            var controller = new Test(scope, $http, errorFormatter, redirectUtil);
//            expect(controller).toBeDefined();
//            $httpBackend.expectPOST('/forgot', {email: 'forgot@forgot.com'}).respond(200);
//            scope.submit();
//            $httpBackend.flush();
//            expect(scope.text.success).toEqual({ title: 'Success!', description: 'Successfully completed request' });
//        });
//
//        it('Set error text on error response from the server', function () {
//            var controller = new Test(scope, $http, errorFormatter, redirectUtil);
//            expect(controller).toBeDefined();
//            $httpBackend.expectPOST('/forgot', {email: 'forgot@forgot.com'}).respond(404);
//            scope.submit();
//            $httpBackend.flush();
//            expect(scope.text.error).toEqual({ title : 'Error!', description : 'Server responded with an Error' });
//        });
//    });
//});

