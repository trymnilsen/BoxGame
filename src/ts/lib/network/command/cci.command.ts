import { CONCommand } from './commandDefinitions';
import { Commands } from './commands';
export function CONEncode(players: CONCommand) :string {
    return JSON.stringify(Commands.WrapCommand(players,Commands.CON));
}
export function CONDecode(data): CONCommand {
    return {
        c: data.substr(4)
    }
}