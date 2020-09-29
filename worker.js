/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('worker');
 * mod.thing == 'a thing'; // true
 */

 
function doTransportWork(creep) {
    var hold = creep.store.getUsedCapacity()
    if (creep.memory.working == true && hold == creep.store.getCapacity()){
        creep.memory.working = false
    }
    else if (creep.memory.working == false && hold == 0) {
        creep.memory.working = true
    }
}

module.exports.build = function(creep,source,target) {
    doTransportWork(creep)
    if (creep.memory.working) {
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source)
        }
    }
    else {
        if (creep.build(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target)
        }    
    }
};

module.exports.harvest = function(creep,source,target) {
    doTransportWork(creep)
    if (creep.memory.working) {
        if (creep.harvest(source,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source)
        }
    }
    else {
        if (creep.transfer(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target) 
        }
    }
}

module.exports.transport = function(creep,source,target,resource) {
    doTransportWork(creep)
    if (creep.memory.working) {
        if (creep.withdraw(source,resource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source)
        }
    }
    else {
        if (creep.transfer(target,resource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target) 
        }
    }
}