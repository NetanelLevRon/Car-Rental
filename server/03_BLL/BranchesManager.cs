using _01_DAL;
using _02_BOL;
using System;
using System.Linq;

namespace _03_BLL
{
    public class BranchesManager
    {
        public static BranchModel[] SelectAllBranches()
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    return ef.Branchs.Select(dbBranch => new BranchModel
                    {
                        BranchID = dbBranch.BranchID,
                        Address = dbBranch.Address,
                        Latitude = (decimal)dbBranch.Latitude,
                        Longitude = (decimal)dbBranch.Longitude,
                        BranchName = dbBranch.branchName
                    }).ToArray();
                }
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
