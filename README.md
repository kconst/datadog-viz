# CPU Load Monitor
###Instructions:
To start the http server, use `node start`.  
index.html provides the UI interface.

####Control Note:
A 100% threshold setting will ensure a “1” value check per the requirements.

###Future Enhancements:
I decided to keep this project as vanilla as possible since it was scoped to be a POC by the take home requirements.  Depending on the application, this could be built with a necessary template and component solution with something like React or Angular.  Since it wasn’t living in a larger ecosystem, I opted not to use those types of libraries/frameworks.  I kept the server as light as possible but it could leverage express or hapi to serve the static content.

I think the test level is adequate but a larger application would need integration tests as well as e2e tests for the custom control fields.  Sanitization could be done on inputs as they are very raw.  It should be noted that Im using the “change” event for the input fields so please be deliberate with any changes.  

The underlying algorithm could use some additional clean up for DRY but I didn’t want to spend too much time polishing the final solution.  I had spent a fair amount of time overall and needed to move on from it.

Note, the D3 chart implementation was heavily borrowed from this example as I am not as familiar with D3.
https://bl.ocks.org/pjsier/fbf9317b31f070fd540c5523fef167ac

