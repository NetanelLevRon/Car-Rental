using _01_DAL;
using _02_BOL;
using System;
using System.Linq;

namespace _03_BLL
{
    public static class UsersManager
    {
        public static bool InsertUser(UserModel newUser)
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    ef.Users.Add(new User
                    {
                        FullName = newUser.FullName,
                        ID = newUser.ID,
                        UserName = newUser.UserName,
                        UserRole = newUser.UserRole,
                        BirthDate = newUser.BirthDate,
                        Gender = newUser.Gender,
                        Email = newUser.Email,
                        Password = newUser.Password,
                        Image = newUser.Image
                    });

                    ef.SaveChanges();
                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return false;
            }

        }

        public static UserModel[] SelectAllUsers()
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    return ef.Users.Select(dbUser => new UserModel
                    {
                        UserID=dbUser.UserID,
                        FullName = dbUser.FullName,
                        ID = dbUser.ID,
                        UserName = dbUser.UserName,
                        UserRole = dbUser.UserRole,
                        BirthDate = dbUser.BirthDate,
                        Gender = dbUser.Gender,
                        Email = dbUser.Email,
                        Password = dbUser.Password,
                        Image = dbUser.Image
                    }).ToArray();
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return null;
            }
        }

        public static UserModel SelectUser(int id) 
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    User SelectedUser = ef.Users.FirstOrDefault(dbUser => dbUser.UserID == id);
                    if (SelectedUser == null)
                        return null;

                    return new UserModel
                    {
                        UserID = SelectedUser.UserID,
                        FullName = SelectedUser.FullName,
                        ID = SelectedUser.ID,
                        UserName = SelectedUser.UserName,
                        UserRole = SelectedUser.UserRole,
                        BirthDate = SelectedUser.BirthDate,
                        Gender = SelectedUser.Gender,
                        Email = SelectedUser.Email,
                        Password = SelectedUser.Password,
                        Image = SelectedUser.Image
                    };
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return null;
            }
        }

        public static UserModel SelectLoginUser(string username, string psw) // used from the authentication filter for seting claims for this user in order to allow, or deny access, according to the role
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    User SelectedUser = ef.Users.FirstOrDefault(dbUser => dbUser.UserName== username && dbUser.Password == psw);
                    if (SelectedUser == null)
                        return null;

                    return new UserModel
                    {
                        UserID = SelectedUser.UserID,
                        FullName = SelectedUser.FullName,
                        ID = SelectedUser.ID,
                        UserName = SelectedUser.UserName,
                        UserRole = SelectedUser.UserRole,
                        BirthDate = SelectedUser.BirthDate,
                        Gender = SelectedUser.Gender,
                        Email = SelectedUser.Email,
                        Password = SelectedUser.Password,
                        Image = SelectedUser.Image
                    };
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return null;
            }
        }
    
        public static bool UpdateUser(UserModel newUser, int id)
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    User selectedUser = ef.Users.FirstOrDefault(dbUser => dbUser.UserID == id);

                    if (selectedUser == null)
                        return false;

                    selectedUser.UserID = newUser.UserID;
                    selectedUser.FullName = newUser.FullName;
                    selectedUser.ID = newUser.ID;
                    selectedUser.UserName = newUser.UserName;
                    selectedUser.UserRole = newUser.UserRole;
                    selectedUser.BirthDate = newUser.BirthDate;
                    selectedUser.Gender = newUser.Gender;
                    selectedUser.Email = newUser.Email;
                    selectedUser.Password = newUser.Password;
                    selectedUser.Image = newUser.Image;

                    ef.SaveChanges();
                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return false;
            }

        }

        public static string DeleteUser(int id)
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    User SelectedUser = ef.Users.FirstOrDefault(dbUser => dbUser.UserID == id);
                    if (SelectedUser == null)
                        return "";

                    ef.Users.Remove(SelectedUser);
                    ef.SaveChanges();
                    return "ok";
                }
            }
            catch (Exception ex)
            {
                return ex.InnerException.InnerException.Message;
            }
        }
    }
}
