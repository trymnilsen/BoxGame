import { CONCommand, 
    PPUCommand, 
    HCWCommand, 
    PJICommand, 
    PLICommand, 
    PSICommand,
    PAACommand, 
    PHICommand, 
    PDICommand, 
    PKICommand } from './commandDefinitions';
export class Commands {
    public static readonly CON = "CON";
    public static readonly PPU = "PPU";
    public static readonly HRS = "HRS";
    public static readonly HCW = "HCW";
    public static readonly PJI = "PJI";
    public static readonly PLI = "PLI";
    public static readonly PSI = "PSI";
    public static readonly PAA = "PAA";
    public static readonly PKI = "PKI";
    public static readonly PDI = "PDI";
    public static readonly PHI = "PHI";
    public static readonly PCI = "PCI";

    public static WrapCommand(data: Object,type:string): Object {
        return {
            "t":type,
            "d":data
        }
    }
}