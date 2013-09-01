##AMLocalization is an AngularJS wrapper for the JED localization library.
In addition it adds the ability to asynchronously load translation files from the server to allow for non blocking
localization

##Installation
npm instructions to come.

Checkout the demo folder to see how the translations work.

    require('am-localization');
    var angular = require('angular');

    var module = angular.module('demo', ['am.localization', 'ngMockE2E'])
        .controller('demoCtrl', function ($scope, amLocalizationService) {
            $scope.englishText = amLocalizationService.gettext('test', 'en_US').fetch('one', 'two');
            $scope.englishTextPlural = amLocalizationService.gettext('test', 'en_US').ifPlural(2).fetch('one', 'two');
            $scope.japaneseText = amLocalizationService.gettext('test', 'jp').fetch('一','二');
            $scope.unknownText = amLocalizationService.gettext('unknown', 'jp').fetch();
        });

Begin by installing npm install i18n-abide --save-dev
Create references to gettext throught your applications js files or create one central translations.js file
Create a template locale directory

    mkdir -p locale/templates/LC_MESSAGES

Run

    ./node_modules/.bin/extract-pot --locale locale ./scripts

If you get an error it means you did not create the templates directory correctly this also assumes your scripts source directory is named 'source'

If you want to add plural translations then you need to use msgid_plural and msgstr[0]-[n]

Once your translations have been extracted you can run the following command replacing the locales you want to translate into.
for example en_US jp = US english and Japanese.

    for l in en_US jp; do
        mkdir -p locale/${l}/LC_MESSAGES/
        msginit --input=./locale/templates/LC_MESSAGES/messages.pot \
                --output-file=./locale/${l}/LC_MESSAGES/messages.po \
                -l ${l}
    done

#Translating files
Install POEdit http://www.poedit.net/download.php or Virtaal http://docs.translatehouse.org/projects/virtaal/en/latest/
in order to translate your generated POT/PO files.

Finally you can convert the po files into valid json files so that the jed translation library can parse them.

    ./node_modules/.bin/compile-json locale public/i18n

