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

Begin by installing i18n-abide

    npm install i18n-abide --save-dev

Create references to gettext throughout your applications js files or create one central translations.js file

##Grunt
If you are using grunt for your project you can add the following grunt-contrib-shell command to your grunt file it
makes the following assumptions
1. In package.json you have your js source directory set "sourceDir"
2. In package.json you have your target language codes set "languages" ( for example "en_US en_UK de es" )
3. in package.json you have your "outputDir" set where your translated json files should be placed (normally your public directory)

    //Run localizations
    shell: {
        pottemplate:{
                        //Make template directory
                        //Load all instances of gettext()
                        command:['mkdir -p locale/templates/LC_MESSAGES',
                            './node_modules/.bin/extract-pot --locale locale <%= pkg.sourceDir %>'
                        ].join('&&')
                    },
                    potfile: {
                        command: [
                            //Turn the template into language files only if they do not already exist
                            'for l in <%= pkg.languages %>; do\n ' +
                                'echo creating languages \n' +
                                'if [ -f ./locale/${l}/LC_MESSAGES/messages.po ]; \n' +
                                'then \n' +
                                'continue \n' +
                                'fi \n' +
                                'mkdir -p locale/${l}/LC_MESSAGES/ \n' +
                                'msginit --input=./locale/templates/LC_MESSAGES/messages.pot ' +
                                '--output-file=./locale/${l}/LC_MESSAGES/messages.po ' +
                                '--no-translator \n' +
                                ' -l ${l} \n' +
                                'done'
                        ].join('&&')
                    },
                    potmerge:{
                        command:[
                            './node_modules/.bin/merge-po ./locale/'
                        ].join('&&')
                    },
                    potoutput: {
                        command:[
                            'rm -rf <%= pkg.outputDir %>/i18n',
                            'mkdir -p <%= pkg.outputDir %>/i18n',
                            //Create files as json ouput for localization
                            './node_modules/.bin/compile-json locale <%= pkg.outputDir %>/i18n'
                        ].join('&&')
                    }
    }

    //Generate localizations
    grunt.registerTask('localize', ['shell:pottemplate', 'shell:potfile', 'shell:potmerge', 'shell:potoutput']);

You can then run the following command to automatically generate your localization files.

    grunt localize


##Without Grunt
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

Finally you can convert the po files into valid json files so that the jed translation library can parse them.

    ./node_modules/.bin/compile-json locale public/i18n

##Translating files
Install POEdit http://www.poedit.net/download.php or Virtaal http://docs.translatehouse.org/projects/virtaal/en/latest/
in order to translate your generated POT/PO files.
