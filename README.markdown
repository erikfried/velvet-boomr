# Simplest usage #
(track page roundtrip times):

    <!DOCTYPE html>
    <html>
    ... 
    <script type="text/javascript">
        BOOMR.init({
            user_ip: "127.0.0.1",  //This should not be hard-coded and should be something unique per "network connection". E g in a jsp it could just be "${request.remoteAddr}"
            BW : { enabled : false },
            VM : { trackers : [{ path : 'erikfried.test.tr.m', val : "t_done"}] }
        });
    </script>
    ...
    </html>

# Configuration #
Configuration of the VM plugin takes place under the 'VM' subobject of the Boomerang configuration . It has one required property

###trackers _\[required\]_###
`array of objects`
Each tracker in the array consists of

+ **path** `string` _\[required\]_ and
+ **val** `string | function (o , custom_vars)`  _\[required\]_

    The typical usage here is to access a parameter directly by its name, using the string argument

    There is also an option to provide a function, possibly calculating som relation between different parameters. As for the arguments to such a function:

    The 'o' here is the object where all standard Boomerang beacon parameters are stored. See: http://yahoo.github.com/boomerang/doc/howtos/howto-0.html

    The 'custom_vars' object contains any custom vars/timers added, and located in the 't_other' parameter



###baseUrl _\[optional\]_###
`string`
defaults to "http://velvetmetrics.com/log". Could be overridden for https or for using some test environment maybe.

See examples folder for working examples.

http://yahoo.github.com/boomerang/doc/howtos/howto-0.html