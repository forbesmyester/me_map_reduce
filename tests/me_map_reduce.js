var me_map_reduce = require('../lib/me_map_reduce.js'),
    expect = require('expect.js');

describe('checksets is called',function() {
    
    it('will detect missing required information',function() {
        
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
                expect(extraData).to.equal('frog');
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
        
        expect(result).to.eql({
            Charles: ['car', 'computer', 'frog'],
            Susan: ['car', 'android', 'audible', 'frog'],
            Matt: ['computer', 'android', 'mountain_bike', 'audible', 'frog'],
            Rei: ['computer', 'android', 'piano', 'frog'],
            Cheryl: ['android', 'mountain_bike', 'frog']
        });
        
    });
});
