#!/bin/bash

#Generates the test specs file for the jasmine runner.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FILE=$DIR/specs.js
TESTDIR=$DIR/../..

echo "Tests directory is " $TESTDIR

echo "generating jasmine specs file " $FILE

#echo \'use strict\'\; > $FILE
echo require\(\[ > $FILE
find $TESTDIR -regex "^.*\.spec\.js$" | sed "s|"$DIR"|'|" | sed "s|spec.js|spec.js',|"  >> $FILE
echo \], function \(\) \{ >> $FILE
echo     var jasmineEnv = jasmine.getEnv\(\)\; >> $FILE
echo     jasmineEnv.execute\(\)\; >> $FILE
echo \}, function \(err\) \{ >> $FILE
echo     console.error\(\'Unable to load some or all of the requires specs. Error message = \' + err\)\; >> $FILE
echo \}\)\; >> $FILE


