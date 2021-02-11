
export class User {

    UserID?: number;

    FullName: string;

    ID: string;

    UserName: string;

    BirthDate: any;  // the reason it is 'any' and not 'Date' is for preview it as default value for 'input type date'
                     // which accept only 'yyyy-MM-dd' format that can be only in type string - (in 'user-view-manager') 
    Gender: boolean; // for switch from boolean => 'true' to 'Male' and 'false' to 'Female'

    Email: string;

    Password: string;

    UserRole?: string;

    Image?: string;
}