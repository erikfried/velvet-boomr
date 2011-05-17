# about #
This is a plugin to [Boomerang](http://yahoo.github.com/boomerang/doc/) from The Exceptional Performance team at Yahoo!.
The plugin allows you to monitor your Boomerang measures via [VelvetMetrics](http://www.velvetmetrics.com/).
It does not affect the default beaconing built into Boomerang,
so you can choose to just send a subset of the data to velvetmetrics and still send the whole thing to wherever you like.

# Simplest usage #
(track page roundtrip times):

    <html>
    ...
    <script src="boomerang.js"></script> <!-- download from:  https://github.com/yahoo/boomerang -->
    <script  src="vm_boomr.js"></script>
    <script>
        BOOMR.init({
            user_ip: "127.0.0.1",  //This should be set properly
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

    The typical usage here is to access a (default or custom) parameter directly by its name, using the string argument

    There is also an option to provide a function, possibly calculating som relation between different parameters, with the arguments :
     **'o'** is the object where all standard Boomerang beacon parameters are stored. See: http://yahoo.github.com/boomerang/doc/howtos/howto-0.html .
     **'custom_vars'** contains any custom vars/timers added, and located in the 't_other' parameter



###baseUrl _\[optional\]_###
`string`
defaults to "http://velvetmetrics.com/log". Could be overridden for https or for using some test environment maybe.

See examples folder for working examples.

http://yahoo.github.com/boomerang/doc/howtos/howto-0.html