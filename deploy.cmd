cmd /c "npm run test"
xcopy web.config .\dist\ /Y
xcopy apple-app-site-association.json .\dist\ /Y
robocopy .\dist\ \\192.168.125.230\extop_front_web /MIR
