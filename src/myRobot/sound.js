




var player = require('play-sound')(opts = {})
 


module.exports={
    playR2D2 
}






function playR2D2(sound){
    player.play('sound/r2d2/'+sound+'.mp3', function(err){
        if (err) console.error(new Error("pb sound R2D2"))
      })
}







// $ mplayer foo.mp3 
// player.play('R2D2.mp3', function(err){
//   if (err) throw err
// })
 
// // { timeout: 300 } will be passed to child process
// player.play('R2D2.mp3', { timeout: 300 }, function(err){
//   if (err) throw err
// })
 
// // configure arguments for executable if any
// player.play('R2D2.mp3', { afplay: ['-v', 1 ] /* lower volume for afplay on OSX */ }, function(err){
//   if (err) throw err
// })
 
// // access the node child_process in case you need to kill it on demand
// var audio = player.play('R2D2.mp3', function(err){
//   if (err && !err.killed) throw err
// })
// audio.kill()



