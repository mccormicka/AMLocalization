##AMLocalization is an AngularJS wrapper for the JED localization library.
In addition it adds the ability to asynchronously load translation files from the server to allow for non blocking
localization

##Installation
#npm instructions to come.

# Begin by installing npm install i18n-abide --save-dev
# Create references to gettext throught your applications js files or create one central translations.js file
# Create a template locale directory mkdir -p locale/templates/LC_MESSAGES

# Run
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

##Finally you can convert the po files into valid json files so that the jed translation library can parse them.

./node_modules/.bin/compile-json locale public/i18n

#Globally install po2json  npm install po2json -g https://github.com/mikeedwards/po2json
#Install POEdit http://www.poedit.net/download.php or Virtaal http://docs.translatehouse.org/projects/virtaal/en/latest/
#



./node_modules/i18n-abide/node_modules/.bin/jsxgettext  --join-existing=true  --keyword=_ -L JavaScript --output-dir=locale/templates/ --from-code=utf-8 --output=messages.pot `find ./scripts -name '*.js' | grep -v node_modules | grep -v .git`