using _01_DAL;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace _02_BOL
{
    class IsUniqueValidator : ValidationAttribute // check if the 'user name' inserted is unique
    {
        public IsUniqueValidator() { ErrorMessage = "this user name alrady taken, please choose a different name"; }

 
        public override bool IsValid(object value) // the hole user as an object for the current user id
        {
            UserModel user = (UserModel) value;  // if the request been sended from 'admin' in order to update some changes and the
            int userId = user.UserID; // 'user name' remain untouched, check if the 'user name' is the current 'user name' by id, and allow it
            string userName = user.UserName;


            if (userName == null)
            {
                return false;
            }
                

            using (CarRentalEntities ef = new CarRentalEntities())
            {
                      User selectedUser = ef.Users.FirstOrDefault(dbUser => dbUser.UserName == userName && dbUser.UserID != userId);

                if (selectedUser != null) // is not unique
                    return false;
            }
            return true;

        }
    }
}

