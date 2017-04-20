import { PPUCommand } from './commandDefinitions';
import { Commands } from './commands';
export function PPUEncode(pos: PPUCommand) :string {
    return `!PPU ${pos.c} ${pos.x.toFixed(1)} ${pos.y.toFixed(1)} ${pos.z.toFixed(1)} ${pos.h.toFixed(1)}`;
}
export function PPUDecode(data: string): PPUCommand {
    let fields = data.split(" ");
    return {
        c: fields[1],
        x: parseFloat(fields[2]),
        y: parseFloat(fields[3]),
        z: parseFloat(fields[4]),
        h: parseFloat(fields[5])
    }
}