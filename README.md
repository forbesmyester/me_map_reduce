# Me Map/Reduce

Me Map Reduce is inspired by [MongoDB](http://www.mongodb.org/)'s map/reduce
functionality.
In javascript you can easily do map/reduce in modern browsers using those 
methods already on the Array Class. But using these functions would always
cause the output to be the same length as the output and there is little
scope for changing the whole structure of the data.
After having done the [Free MongoDB Courses](https://education.10gen.com/) 
recently I saw how an emitting version of Map/Reduce could be used to do 
quite large scale data manipluations.

This library has been tested in:

 * Node (mocha command line BDD tests included)
 * Chrome/FF with jQuery v1.9.1
 * Chrome/FF with Dojo v1.8.3
 * Chrome/FF with no other libraries
 * Internet Explorer 7 with jQuery
 
## Example

    var possessions = {
        'car': ['Charles', 'Susan'],
        'computer': ['Matt', 'Charles','Rei'],
        'android': ['Matt', 'Susan', 'Rei','Cheryl'],
        'mountain_bike': ['Matt' ,'Cheryl'],
        'audible': ['Matt','Susan'],
        'piano': ['Rei']
    };
    
    var result = me_map_reduce(
        possessions,
        function(key,data,emit,extraData) {
            var i = 0;
            for (i=0;i<data.length;i++) {
                emit(data[i],key);
            }
        },
        function(emittedK,emittedValues,extraData) {
            emittedValues.push(extraData);
            return emittedValues;
        },
        'frog'
    );
    
    // result = {
        Charles: ['car', 'computer', 'frog'],
        Susan: ['car', 'android', 'audible', 'frog'],
        Matt: ['computer', 'android', 'mountain_bike', 'audible', 'frog'],
        Rei: ['computer', 'android', 'piano', 'frog'],
        Cheryl: ['android', 'mountain_bike', 'frog']
    }

## Copyright / Ownership

Author: Matthew Forrester <matthew.forrester@mediaequals.com> / <matt@keyboardwritescode.com>
Copyright: 2013 MediaEquals Ltd / Matthew Forrester
License: BSD-style

Thanks To: My Boss, Jon Bradshaw, for letting me release the initial version.