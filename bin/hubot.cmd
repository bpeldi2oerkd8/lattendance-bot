@echo off

call yarn install
SETLOCAL
SET PATH=node_modules\.bin;node_modules\hubot\node_modules\.bin;%PATH%

node_modules\hubot\bin\hubot.cmd --name "lattendance-bot" %* 
