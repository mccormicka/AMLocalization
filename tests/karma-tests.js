'use strict';

var tests = Object.keys(window.__karma__.files).filter(function (file) {
    var result = (/\\*spec\.js/).test(file);
    if (result) {
        console.log('file is ', file);
    }
    return result;
});

require({
    baseUrl: '/base/',
    paths: {
        'am-localization': 'scripts/index',
        angular: 'components/angular/angular',
        'angular-mocks': 'components/angular-mocks/angular-mocks',
        jed: 'components/jed/jed'
    },
    shim:{
        angular: {
            exports: 'angular'
        },
        'angular-mocks':{
            deps:['angular'],
            exports:'angular-mocks'
        }
    },

    deps: tests,

    callback: window.__karma__.start
});