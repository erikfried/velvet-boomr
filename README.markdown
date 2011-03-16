# Simplest usage #
(track page roundtrip times):

    <!DOCTYPE html>
    <html>
    ... 
    <script type="text/javascript">
        BOOMR.init({
            user_ip: "127.0.0.1",  //This should not be hard-coded and should be something unique per "network connection". E g in a jsp it could just be "${request.remoteAddr}"
            beacon_url: "http://www.velvetmetrics.com/log",
            BW : { enabled : false },
            VM : { trackers : [{ path : 'erikfried.test.tr.m', resolver : "t_done"}] }
        });
    </script>
    ...
    </html>

# Configuration #
Configuration of the VM plugin takes place under the 'VM' subobject of the Boomerang configuration . It takes one parameter
    trackers (array of objects) [required]
        each tracker in the array consists of
            path (string) [required] and
            resolver (string | function (o , custom_vars) [required] 

See examples folder for working examples.

http://yahoo.github.com/boomerang/doc/howtos/howto-0.html