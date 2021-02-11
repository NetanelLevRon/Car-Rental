export class CarType {

    CarTypeID?: number;
    ManufacturerName: string;
    Model: string;
    DayCost: number;
    DayLateCost: number;
    ManufacturerYear: number;
    Transmission: boolean; // switch from boolean => 'true' to 'Auto' and 'false' to 'Manual'
}