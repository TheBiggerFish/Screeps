// Memory.BODYPART_COST={ "move": 50, "work": 100, "attack": 80, "carry": 50, "heal": 250, "ranged_attack": 150, "tough": 10, "claim": 600 }

module.exports.loop = function () {
    Memory.CREEP_COUNT = Object.keys(Game.creeps).length;

    //Roles: https://jsonformatter.curiousconcept.com
    Memory.ROLES = {"HARVESTER":{"name":"harvester","count":8,"loadout":[MOVE,WORK,WORK,CARRY]},"UPGRADER":{"name":"upgrader","count":6,"loadout":[MOVE,WORK,WORK,CARRY]},"BUILDER":{"name":"builder","count":3,"loadout":[MOVE,WORK,WORK,CARRY]}}


    maintainRole(Memory.ROLES.BUILDER)
    maintainRole(Memory.ROLES.UPGRADER)
    maintainRole(Memory.ROLES.HARVESTER)
    for(var key in Game.creeps) {
        var creep = Game.creeps[key]
        if (creep.memory.role == 'harvester') {
            harvest(creep,Game.getObjectById(Memory.SOURCES[0]),Game.spawns.Spawn1)
        }
        if (creep.memory.role == 'upgrader') {
            harvest(creep,Game.getObjectById(Memory.SOURCES[1]),creep.room.controller)
        }
        if(creep.memory.role == 'builder') {
            build(creep,Game.getObjectById(Memory.SOURCES[0]),creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES))
        }
    }
};

function doEnergyTransport(creep) {
    if (creep.memory.working == true && creep.store.energy == creep.store.getCapacity()){
        creep.memory.working = false
    }
    else if (creep.memory.working == false && creep.store.energy == 0) {
        creep.memory.working = true
    }
}

function harvest(creep,source,target) {
    doEnergyTransport(creep)
    if (creep.memory.working) {
        if (creep.pos.inRangeTo(source,1))
            creep.harvest(source,RESOURCE_ENERGY)
        else
            creep.moveTo(source) 
    }
    else {
        if (creep.pos.inRangeTo(target,1))
            creep.transfer(target,RESOURCE_ENERGY)
        else
            creep.moveTo(target) 
    }
}

function build(creep,source,target) {
    doEnergyTransport(creep)
    if (creep.memory.working == false) {
        if (creep.build(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target)
        }    
    }
    else {
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source)
        }
    }
}

function maintainRole(role) {
    for (var i = role.count; i > 0; i--) {
        var worker_name = role.name + i.toString()
        var rv = Game.spawns.Spawn1.spawnCreep(role.loadout,worker_name,{memory:{'role':role.name,'working':true}})
        if(rv == OK)
            console.log('Creating a new', role.name)
    }    
}