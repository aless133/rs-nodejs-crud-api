@echo off
start npm run start:multi
set /p exitkey= "Press ENTER to run the tests when server started"
cmd /cnpm run test:server
set /p exitkey= "Press ENTER to exit..."