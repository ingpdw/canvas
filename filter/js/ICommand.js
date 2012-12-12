p.command.ICommand = function(){
	
};

p.command.ICommand.prototype.execute = function(){};

p.command.ICommand.prototype.undo = function(){};
p.command.CommandManager = {
	commands: [],
	redos: [],
	MAXCOMMAND: 30,	
	lastCommand: null,

	executeCommand: function(command){

		if(command instanceof p.command.Undo){
			this.undo();
			return;
		}
		
		if(command instanceof p.command.Redo){
			this.redo();
			return;
		}
		
		if(command.execute()){
			this.addToHistory(command);
		}else{
			//failed
		}
	},

	addToHistory: function(command){
		if(this.MAXCOMMAND <= this.commands.length){
			this.commands.shift();
		}
		
		this.commands.push(command);
		this.lastCommand = command;
	},

	undo: function(){
		if(this.commands.length > 0){
			var undo = this.commands.pop();
				undo.undo();
			this.redos.push(undo);
		}	
	},

	redo: function(){
		if(this.redos.length > 0){
			var redo = this.redos.pop();
				redo.execute();
			this.commands.push(redo);
		}	
	}
};