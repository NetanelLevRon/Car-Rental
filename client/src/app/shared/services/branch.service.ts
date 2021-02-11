import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Branch } from "../models/branch.model";
import { BranchStore } from "../models/branch-store.model";


@Injectable()
export class BranchService {
    private link = "http://localhost:53312/api/Branch";
    public urlPrefix: string = "http://localhost:53312/Image/";
    public branch: Branch = new Branch();
    public branchInfo: BranchStore = new BranchStore();

    constructor(private myHttpClient: HttpClient) {
    }

    //GET : get all branchs from server (and save the returned value to a property in this service)
    getBranchs(): Array<Branch> { 
        this.myHttpClient.get(this.link)
            .subscribe((x: Array<Branch>) => { Object.assign(this.branchInfo.branchList = x); }
            ,(err:HttpErrorResponse)=>{console.log(err); },
            ()=>{ console.log("from car service branchInfo.branchList[0].BranchName = " + this.branchInfo.branchList[0].BranchName);}
            );
            return this.branchInfo.branchList;
    }

}

