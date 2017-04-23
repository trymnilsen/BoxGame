import { CCICommand } from './commandDefinitions';
import { Commands } from './commands';
export function CCIEncode(players: CCICommand) :string {
    return JSON.stringify(Commands.WrapCommand(players,Commands.CCI));
}
export function CCIDecode(data): CCICommand {
    return {
        c: data.substr(4)
    }
}