//Written by Cameron Haddock
//A Screeps module for creeps to do work


/**
 * Perform work with the given creep
 * @param {Creep} creep 
 */
module.exports.work = function(creep) {
    doTransportWork(creep)
    if (creep.memory.role == 'harvester') {
        //this.harvest(creep,Game.getObjectById(creep.room.memory.SOURCES[1].source.id),creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: struct => (struct instanceof StructureContainer) || (struct instanceof StructureSpawn)}))//Game.spawns.Spawn1)
        this.harvest(creep,Game.getObjectById(creep.room.memory.SOURCES[1].source.id),Game.spawns.Spawn1)
    }
    if (creep.memory.role == 'upgrader') {
        this.upgrade(creep,Game.getObjectById(creep.room.memory.SOURCES[0].source.id))
    }
    if(creep.memory.role == 'builder') {
        this.build(creep,Game.getObjectById(creep.room.memory.SOURCES[1].source.id),creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES))
    }
    if(creep.memory.role == 'transporter') {
        this.transport(creep,creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}}),Game.spawns.Spawn1,RESOURCE_ENERGY)
    }
    if(creep.memory.role == 'mechanic') {
        this.repair(creep,creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}}),creep.pos.findClosestByPath(FIND_STRUCTURES, object => object.hits < object.hitsMax))
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
        var move = false
        if (source instanceof Source)
            move = creep.harvest(source) == ERR_NOT_IN_RANGE
        else if(source instanceof Store || source instanceof Structure) 
            move = creep.withdraw(source,resource) == ERR_NOT_IN_RANGE
        if (move) 
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
        //console.log("Harvest",creep.name,source.pos)
        if (creep.harvest(source,resource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source)
        }
    }
    else {
        //console.log("Transfer",creep.name,target.pos,Memory.ERRORS[creep.transfer(target,resource).toString()])
        var rv = creep.transfer(target,resource)
        if (rv == ERR_NOT_IN_RANGE) {
            creep.moveTo(target) 
        } else if (rv == ERR_FULL) {
            //console.log("Full target", creep.name, target.pos)
        }
    }
}


/**
 * Perform the duties of the upgrade role for the given creep
 * @param {Creep} creep - The creep performing the transport actions
 * @param {(Source|Store|Structure)} source - The source where the creep will acquire the resource
 */
module.exports.upgrade = function(creep,source) {
    if (creep.memory.working) {
        var move = false
        if (source instanceof Source)
            move = creep.harvest(source) == ERR_NOT_IN_RANGE
        else if(source instanceof Store || source instanceof Structure) 
            move = creep.withdraw(source,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        if (move) 
            creep.moveTo(source)
    }
    else {
        var target = creep.room.controller
        if (creep.transfer(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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
        var move = false
        if (source instanceof Source)
            move = creep.harvest(source) == ERR_NOT_IN_RANGE
        else if(source instanceof Store || source instanceof Structure) 
            move = creep.withdraw(source,resource) == ERR_NOT_IN_RANGE
        if (move) 
            creep.moveTo(source)
    }
    else {
        if (creep.transfer(target,resource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target) 
        }
    }
}


/**
 * Perform the duties of the mechanic role for the given creep
 * @param {Creep} creep - The creep performing the mechanic actions
 * @param {(Source|Store|Structure)} source - The source where the creep will acquire the energy
 * @param {Structure} target - The target that the creep will repair
 */
module.exports.repair = function(creep,source,target) {
    if (creep.memory.working) {
        var move = false
        if (source instanceof Source)
            move = creep.harvest(source) == ERR_NOT_IN_RANGE
        else if(source instanceof Store || source instanceof Structure) 
            move = creep.withdraw(source,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        if (move) 
            creep.moveTo(source)
    }
    else {
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target) 
        }
    }
}
