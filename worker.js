/**
 * Set the .working property of a given creep based on storage capacity
 * @param {Creep} creep
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


/**
 * Perform the duties of the build role for the given creep
 * @param {Creep} creep - The creep performing the build actions
 * @param {(Source|Store|Structure)} source - The source where the creep will acquire the resource
 * @param {ConstructionSite} target - The target that will be built
 * @param {ResourceConstant} resource - The resource with which to build the target
 */
module.exports.build = function(creep,source,target,resource=RESOURCE_ENERGY) {
    doTransportWork(creep)
    if (creep.memory.working) {
        var successful = false
        if (source instanceof Source)
            successful = creep.harvest(source) == ERR_NOT_IN_RANGE
        else if(source instanceof Store) 
            successful = creep.transfer

        if (!successful) 
            creep.moveTo(source)
    }
    else {
        if (creep.build(target,resource) == ERR_NOT_IN_RANGE) {
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