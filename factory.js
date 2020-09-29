/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('factory');
 * mod.thing == 'a thing'; // true
 */


module.exports.produce = function() {
    for(var spawn in Game.spawns) {
        Game.spawns[spawn].memory;
        if(!Object.keys(Memory.spawns[spawn]).includes("NEXT_SPAWN")){
            Game.spawns[spawn].memory.NEXT_SPAWN = {"COST":-1,"NAME":""}
        }
        
        //console.log(Object.keys(Memory.spawns.Spawn1.NEXT_SPAWN).includes('COST'))
    }
};

module.exports.maintainRole = function(role) {
    for (var i = role.count; i > 0; i--) {
        var worker_name = role.name + i.toString()
        var rv = Game.spawns.Spawn1.spawnCreep(role.loadouts[0],worker_name,{memory:{'role':role.name,'working':true}})
        //console.log(worker_name,rv)
        if(rv == OK)
          console.log('Creating a new', role.name)
    }    
}

