/*global $:false, window:false */

(function(exporterFunction,deepCopyFunction) {
exporterFunction(

// # Me Map/Reduce
//
// Me Map Reduce is inspired by [MongoDB](http://www.mongodb.org/)'s map/reduce
// functionality.
//
// In javascript you can easily do map/reduce in modern browsers using those 
// methods already on the Array Class. But using these functions would always
// cause the output to be the same length as the output and there is little
// scope for changing the whole structure of the data.
//
// After having done the [Free MongoDB Courses](https://education.10gen.com/) 
// recently I saw how an emitting version of Map/Reduce could be used to do 
// quite large scale data manipluations.
// 
// This library has been tested in:
// 
//  * Node (mocha command line BDD tests included)
//  * Chrome/FF with jQuery v1.9.1
//  * Chrome/FF with Dojo v1.8.3
//  * Chrome/FF with no other libraries
//  * Internet Explorer 7 with jQuery
// 
// Author: Matthew Forrester <matthew.forrester@mediaequals.com> / <matt@keyboardwritescode.com>
// Copyright: 2013 MediaEquals Ltd / Matthew Forrester
// License: BSD-style
// 
// Thanks To: My Boss, Jon Bradshaw, for letting me release the initial version.
//
// ## me_map_reduce()
// 
// ### Example
// 
//     var possessions = {
//         'car': ['Charles', 'Susan'],
//         'computer': ['Matt', 'Charles','Rei'],
//         'android': ['Matt', 'Susan', 'Rei','Cheryl'],
//         'mountain_bike': ['Matt' ,'Cheryl'],
//         'audible': ['Matt','Susan'],
//         'piano': ['Rei']
//     };
//     
//     var result = me_map_reduce(
//         possessions,
//         function(key,data,emit,extraData) {
//             var i = 0;
//             for (i=0;i<data.length;i++) {
//                 emit(data[i],key);
//             }
//         },
//         function(emittedK,emittedValues,extraData) {
//             emittedValues.push(extraData);
//             return emittedValues;
//         },
//         'frog'
//     );
//     
//     // result = {
//         Charles: ['car', 'computer', 'frog'],
//         Susan: ['car', 'android', 'audible', 'frog'],
//         Matt: ['computer', 'android', 'mountain_bike', 'audible', 'frog'],
//         Rei: ['computer', 'android', 'piano', 'frog'],
//         Cheryl: ['android', 'mountain_bike', 'frog']
//     }
//
// ### Parameters
// 
// * **@param {Object} `inData`** Object of KV Pairs to Map/Reduce
// * **@param {Function} `mapFunc`** Signature: function(key,value,emit,extraData)
//   * **@param {String} `mapFunc.key`** A key from the `inData`
//   * **@param {String} `mapFunc.value`** A value from the `inData`
//   * **@param {Function} `mapFunc.emit`** Emits values into `reduceFunc` - Signature function(key,value)
//   * **@param {Object} `mapFunc.extraData`** See parameter four of `me_map_reduce` function
// * **@param {Function} `reduceFunc`** Signature: function(emittedK,emittedValues,extraData)
//   * **@param {String} `reduceFunc.emittedK`** First argument of `mapFunc.emit`
//   * **@param {Array} `reduceFunc.emittedValues`** All the second arguments of `mapFunc.emit`
//   * **@param {Object} `reduceFunc.extraData`** See parameter four of `me_map_reduce` function
// * **@param {Object} `extraData`** This will be passed into mapFunc and reduceFunc
// * **@return {Object}** The result of the Map/Reduce
// * **@author** Matthew Forrester <matthew.forrester@mediaequals.com>
function(inData,mapFunc,reduceFunc,extraData) {
    var k,
        emit,
        mapped = {},
        inDataCopy,
        ret = {},
        r;
        
    emit = function(key,val) {
        if (!mapped.hasOwnProperty(key)) {
            mapped[key] = [];
        }
        mapped[key].push(val);
    };
    inDataCopy = deepCopyFunction(inData);
    for (k in inData) {
        mapFunc(k,inDataCopy[k],emit,extraData);
    }
    ret = {};
    for (k in mapped) {
        r = reduceFunc(k,mapped[k],extraData);
        if (r !== null) {
            ret[k] = r;
        }
    }
    return ret;
});
})(
    (function() { // Gets an exportFunction to normalize Node / Dojo / window.*
        
        if ((typeof module != 'undefined') && (module.exports)) { // Node Module
            return function(me_map_reduce) {
                module.exports = me_map_reduce;
                return;
            };
        }
        if (typeof define != 'undefined' && define.hasOwnProperty('amd') && define.amd) { // Dojo AMD
            return function(me_map_reduce) {
                define(function() {
                    return me_map_reduce;
                });
            };
        }
        if ((typeof $ === 'function') && ($.hasOwnProperty('extend'))) { // jQuery Plugin
            return function(source) {
                return $.extend(true, $, {me_map_reduce: source} );
            };
        }
        if (typeof window != 'undefined') { // Fall down to attaching to window...
            return function(me_map_reduce) {
                window.me_map_reduce = me_map_reduce;
            };
        }
        
    })(),
    (function() { // Gets the deepCopyFunction
        if ((typeof $ === 'function') && ($.hasOwnProperty('extend'))) {
            return function(source) {
                return $.extend(true, {}, source);
            };
        }
        if (
            (typeof module != 'undefined') &&
            (module.hasOwnProperty('exports'))
        ) {
            var extend = require('node.extend');
            return function(source) {
                return extend(true, {}, source);
            };
        }
        if (
            (typeof JSON != 'undefined') &&
            JSON.hasOwnProperty('stringify') && 
            JSON.hasOwnProperty('parse')
        ) {
            return function(source) {
                return JSON.parse(JSON.stringify(source));
            };
        }
        return undefined;
    })()
);