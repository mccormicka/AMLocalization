'use strict';
var require = {
    baseUrl: '/',
    paths: {
        'am-localization': 'scripts/index',
        angular: 'components/angular/angular',
        'angular-mocks': 'components/angular-mocks/angular-mocks',
        jed: 'components/jed/jed',
        lodash: 'components/lodash/lodash'
    },
    shim:{
        angular: {
            exports: 'angular'
        },
        'angular-mocks':{
            deps:['angular'],
            exports:'angular-mocks'
        }
    }
};