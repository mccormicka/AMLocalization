define(function (require) {
    'use strict';

    require('scripts/Service');

    var angular = require('angular');
    var module = angular.module('am.localization', [])
        .service('amLocalizationService', require('scripts/Service'));
    return module;
});