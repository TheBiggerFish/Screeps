//Written by Cameron Haddock
//A Screeps module for creeps to do work


/**
 * Perform work with the given creep
 * @param {Creep} creep 
 */
module.exports.work = function(creep) {
    doTransportWork(creep)
    if (creep.memory.role == 'harvester') {
        this.harvest(creep,Game.getObjectById(Memory.SOURCES[0]),Game.spawns.Spawn1)
    }
    if (creep.memory.role == 'upgrader') {
        this.harvest(creep,Game.getObjectById(Memory.SOURCES[1]),creep.room.controller)
    }
    if(creep.memory.role == 'builder') {
        this.build(creep,Game.getObjectById(Memory.SOURCES[0]),creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES))
    }
    if(creep.memory.role == 'transporter') {
        
    }
}


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
    if (creep.memory.working) {
        var successful = false
        if (source instanceof Source)
            successful = creep.harvest(source) == ERR_NOT_IN_RANGE
        else if(source instanceof Store || source instanceof Structure) 
            successful = creep.withdraw(source) == ERR_NOT_IN_RANGE
        if (!successful) 
            creep.moveTo(source)
    }
    else {
        if (creep.build(target,resource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target)
        }    
    }
};


/**
 * Perform the duties of the harvest role for the given creep
 * @param {Creep} creep - The creep performing the harvest actions
 * @param {(Source|Deposit|Mineral)} source - The source where the creep will harvest the resource
 * @param {(Creep|Store|Structure)} target - The target where the creep will deliver the resource
 * @param {ResourceConstant} resource - The resource to harvest
 */
module.exports.harvest = function(creep,source,target,resource=RESOURCE_ENERGY) {
    if (creep.memory.working) {
        if (creep.harvest(source,resource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source)
        }
    }
    else {
        if (creep.transfer(target,resource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target) 
        }
    }
}


/**
 * Perform the duties of the transport role for the given creep
 * @param {Creep} creep - The creep performing the transport actions
 * @param {(Source|Store|Structure)} source - The source where the creep will acquire the resource
 * @param {(Creep|Source|Store|Structure)} target - The target where the creep will deliver the resource
 * @param {ResourceConstant} resource - The resource with which to build the target
 */
module.exports.transport = function(creep,source,target,resource) {
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

