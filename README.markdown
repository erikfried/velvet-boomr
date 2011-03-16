* Simplest usage (track page roundtrip times):

    <!DOCTYPE html>
    <html>
    <body>
    <script type="text/javascript" src="boomerang.js"></script> <!-- dependency - download from:  https://github.com/yahoo/boomerang -->
    <script type="text/javascript" src="vm_boomr.js"></script>
    <script type="text/javascript">

        BOOMR.init({
            user_ip: "127.0.0.1",  //This should not be hard-coded and should be something unique per "network connection". E g in a jsp it could just be "${request.remoteAddr}"
            beacon_url: "http://www.velvetmetrics.com/log",
            BW : { enabled : false },
            VM : { trackers : [{ path : 'erikfried.test.tr.m', resolver : "t_done"}] }
        });

    </script>
    </body>
    </html>

* Configuration of the VM plugin takes place under the 'VM' namespace of the Boomerang configuration. It takes one parameter
    trackers (array of objects) [required]
        each tracker in the array consists of
            path (string) [required]


 See examples folder for working examples.

http://yahoo.github.com/boomerang/doc/howtos/howto-0.html