- DMi.Vision.Web

Uses grunt-template to load environment specific urls (production or development) into js and html files. The values are stored in the json files in the Config folder. 
The default environment is 'development'. In case you need to publish to a different environment change the environment setting by entering the following command in the Visual Studio's Package Manager Console:
$env:ENV='production'
or
$env:ENV='staging'
etc..

The template task can be run from the task runner or by entering 'grunt template' in the pm console (make sure you run the command from the folder where the gruntfile is located).
The task can also be bound to the before build event in the task runner. This will ensure the task is run before publishing.