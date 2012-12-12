p.command.Undo = function(){
	p.command.CommandManager.executeCommand(this);
};

p.command.Undo.prototype = new p.command.AbstractCommand;

p.command.Undo.prototype.execute = function(){
	return true;
};