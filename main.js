// Initialize Phaser, and create a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

var sprite;

// Create our 'main' state that will contain the game
var mainState = {

   preload: function() {  
        // Change the background color of the game
        game.stage.backgroundColor = '#71c5cf';
       
        // Load the pipe sprite
        game.load.image('pipe', 'assets/pipe.png');
       
        // Load cat sprite
        game.load.spritesheet('cat', 'assets/catanimation.png', 33, 26);
       
        // Load Cloud
       game.load.image('cloud', 'assets/cloud.png');
   },

    create: function() {  
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Start game on enter press
        var enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterKey.onDown.add(this.startGame, this);
        
        // Add clouds
        this.clouds = game.add.group();
        this.clouds.enableBody = true;
        this.clouds.createMultiple(10, 'cloud');
        this.clouds.z = 0;
        
        this.pipes = game.add.group(); // Create a group  
        this.pipes.enableBody = true;  // Add physics to the group  
        this.pipes.createMultiple(20, 'pipe'); // Create 20 pipes
        this.pipes.z = 1;
        
        this.score = 0;  
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
        
        this.prompt = game.add.text(30,250,"Press ENTER to Start.", {font: "25px Arial", fill: "#333333"});
        
        // Cat sprite
        sprite = game.add.sprite(40, 100, 'cat');
        sprite.scale.setTo(1.5,1.5);
        
        game.physics.arcade.enable(sprite);

        sprite.animations.add('fly');
        
        sprite.z = 2;
        
    },

    update: function() {  
        // If the bird is out of the world (too high or too low), call the 'restartGame' function
        if (sprite.inWorld == false)
            this.restartGame();
        
        game.physics.arcade.overlap(sprite, this.pipes, this.restartGame, null, this);
    },
    
    addcloud: function() {
        var cloud = this.clouds.getFirstDead();
        
        cloud.reset(500, Math.floor((Math.random() * 200) + 50));
        cloud.body.velocity.x = -250;
        cloud.scale.setTo(.1,.1);
        
        cloud.checkWorldBounds = true;
        cloud.outOfBoundsKill = true;
    },

        // Make the bird jump 
    jump: function() {  
        // Add a vertical velocity to the bird
        sprite.body.velocity.y = -350;
    },

    // Restart the game
    restartGame: function() {  
        // Start the 'main' state, which restarts the game
        game.state.start('main');
        this.prompt = game.add.text(30,250,"Press ENTER to Start.", {font: "25px Arial", fill: "#333333"});
    },
    
    addOnePipe: function(x, y) {  
        // Get the first dead pipe of our group
        var pipe = this.pipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 

        // Kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    
    addRowOfPipes: function() {  
        // Pick where the hole will be
        var hole = Math.floor(Math.random() * 5) + 1;

        // Add the 6 pipes 
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOnePipe(400, i * 60 + 10);   
        
        this.score += 1;  
        this.labelScore.text = this.score; 
    },
    
    startGame: function() {
        this.cloudtimer = game.time.events.loop(1000, this.addcloud, this);
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        sprite.body.gravity.y = 1000;
        sprite.animations.play('fly', 15 , true);
        this.prompt.destroy();
        
        // Call the 'jump' function when the spacekey is hit
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
    },


};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);  
game.state.start('main');  

