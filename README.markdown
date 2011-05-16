# Simplest usage #
(track page roundtrip times):

    <!DOCTYPE html>
    <html>
    ... 
    <script type="text/javascript">
        BOOMR.init({
            user_ip: "127.0.0.1",  //This should not be hard-coded and should be something unique per "network connection". E g in a jsp it could just be "${request.remoteAddr}"
            BW : { enabled : false },
            VM : { trackers : [{ path : 'erikfried.test.tr.m', timerName : "t_done"}] }
        });
    </script>
    ...
    </html>

# Configuration #
Configuration of the VM plugin takes place under the 'VM' subobject of the Boomerang configuration . It has one required property

+ **trackers** array of objects _\[required\]_ each tracker in the array consists of
++ **path** string _\[required\]_ and
++ **val** `string | function (o , custom_vars)`  _\[required\]_

+ *baseUrl* _\[optional\]_ defaults to "http://velvetmetrics.com/log". Could be overridden for https or for using some test environment maybe.

See examples folder for working examples.

http://yahoo.github.com/boomerang/doc/howtos/howto-0.html