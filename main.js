module.exports.loop = function () {
    var worker = require('worker');
    var factory = require('factory');
    factory.produce()

    //Roles: https://jsonformatter.curiousconcept.com
    Memory.ROLES = {"ROLE_PRIORITIES":["HARVESTER","UPGRADER","BUILDER","TRANSPORTER"],"ROLES":{"HARVESTER":{"name":"harvester","count":8,"loadouts":[[MOVE,MOVE,WORK,CARRY],[MOVE,WORK,WORK,CARRY]]},"UPGRADER":{"name":"upgrader","count":6,"loadouts":[[MOVE,MOVE,WORK,CARRY],[MOVE,WORK,WORK,CARRY]]},"BUILDER":{"name":"builder","count":4,"loadouts":[[MOVE,MOVE,WORK,CARRY],[MOVE,WORK,WORK,CARRY]]},"TRANSPORTER":{"name":"transporter","count":0,"loadouts":[[MOVE,MOVE,MOVE,CARRY,CARRY,CARRY]]}}}
    Memory.NUMERICS.CREEP_COUNT = Object.keys(Game.creeps).length;
    Memory.NUMERICS.ROLES = Object.keys(Memory.ROLES.ROLES).length;

    for(var i = Memory.NUMERICS.ROLES; i > 0; i--) {
        var role = Memory.ROLES.ROLE_PRIORITIES[i-1]
        factory.maintainRole(Memory.ROLES.ROLES[role])
    }
    for(var key in Game.creeps) {
        var creep = Game.creeps[key]
        if (creep.memory.role == 'harvester') {
            worker.harvest(creep,Game.getObjectById(Memory.SOURCES[0]),Game.spawns.Spawn1)
        }
        if (creep.memory.role == 'upgrader') {
            worker.harvest(creep,Game.getObjectById(Memory.SOURCES[1]),creep.room.controller)
        }
        if(creep.memory.role == 'builder') {
            worker.build(creep,Game.getObjectById(Memory.SOURCES[0]),creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES))
        }
        if(creep.memory.role == 'transporter') {
            
        }
    }
};