var worker = require('worker');
var factory = require('factory');

module.exports.loop = function () {
    factory.produce()
    doMemoryConstants()

    for(var key in Game.creeps) {
        var creep = Game.creeps[key]
        worker.work(creep)
    }
};


function doMemoryConstants() {
    //Roles: https://jsonformatter.curiousconcept.com
    Memory.ROLES = {"HARVESTER":{"name":"harvester","count":6,"base_priority":10,"loadouts":[["move","work","work","carry"],["move","work","work","carry"]]},"UPGRADER":{"name":"upgrader","count":6,"base_priority":20,"loadouts":[["move","move","work","carry"],["move","work","work","carry"]]},"BUILDER":{"name":"builder","count":4,"base_priority":30,"loadouts":[["move","move","work","carry"],["move","work","work","carry"]]},"TRANSPORTER":{"name":"transporter","count":0,"base_priority":40,"loadouts":[["move","move","move","carry","carry","carry"]]},"MECHANIC":{"name":"mechanic","count":0,"base_priority":50,"loadouts":[["move","move","move","carry","carry","carry"]]}}
    Memory.NUMERICS.CREEP_COUNT = Object.keys(Game.creeps).length;
    Memory.NUMERICS.ROLES = Object.keys(Memory.ROLES).length;

    var expectedCreeps = 0
    for(var roleName in Memory.ROLES) {
        expectedCreeps += Memory.ROLES[roleName].count
    }
    Memory.NUMERICS.CREEP_COUNT_EXPECTED = expectedCreeps

    for(var spawnName in Game.spawns) {
        if(!Object.keys(Memory.spawns).includes(spawnName)){

            var spawn = Game.spawns[spawnName]
            spawn.memory
            spawn.memory.NEXT_SPAWN = {"COST":-1,"ROLE":"","NAME":""}
            spawn.room.memory.SOURCES = spawn.room.lookForAtArea(LOOK_SOURCES,0,0,49,49,true)
        }
    }

}