/*global $:false, window:false */

/**
 * @param {Object} inData Object of KV Pairs to Map/Reduce
 * @param {Function} mapFunc Signature: function(key,value,emit,extraData)
 * @param {Function} reduceFunc Signature: function(emittedK,emittedValues,extraData)
 * @param {Object} extraData This will be passed into mapFunc and reduceFunc
 * @return {Object} The result of the Map/Reduce
 */
var me_map_reduce = function(inData,mapFunc,reduceFunc,extraData) {
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
    inDataCopy = $.extend(true, {}, inData);
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
};

window.me_map_reduce = me_map_reduce;