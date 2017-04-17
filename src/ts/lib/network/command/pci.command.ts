import { PCICommand } from './commandDefinitions';
import { Commands } from './commands';
export function PCIEncode(players: PCICommand) :string {
    return JSON.stringify(Commands.WrapCommand(players,Commands.PCI));
}