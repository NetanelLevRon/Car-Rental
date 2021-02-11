using _01_DAL;
using _02_BOL;
using System;
using System.Linq;

namespace _03_BLL
{
    public class CarsManager
    {
        public static CarModel[] SelectAllCars()
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    return ef.Cars.Select(dbCar => new CarModel
                    {
                        CarID = dbCar.CarID,
                        CarTypeID = dbCar.CarTypeID,
                        CurrentMileage = dbCar.CurrentMileage,
                        Image = dbCar.Image,
                        IsProper = dbCar.IsProper,
                        IsAvailable = dbCar.IsAvailable,
                        LicensePlate = dbCar.LicensePlate,
                        BranchID = dbCar.BranchID
                    }).ToArray();
                }
            }
            catch (Exception)
            {
                return null;
            }
        }

        public static CarModel SelectCar(int id)
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    Car SelectedCar = ef.Cars.FirstOrDefault(dbCar => dbCar.CarID == id);
                    if (SelectedCar == null)
                        return null;

                    return new CarModel
                    {
                        CarID = SelectedCar.CarID,
                        CarTypeID = SelectedCar.CarTypeID,
                        CurrentMileage = SelectedCar.CurrentMileage,
                        Image = SelectedCar.Image,
                        IsProper = SelectedCar.IsProper,
                        IsAvailable = SelectedCar.IsAvailable,
                        LicensePlate = SelectedCar.LicensePlate,
                        BranchID = SelectedCar.BranchID
                    };
                }
            }
            catch (Exception)
            {
                return null;
            }
        }

        public static CarModel SelectCarByLicensePlate(string licensePlate)
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    Car SelectedCar = ef.Cars.FirstOrDefault(dbCar => dbCar.LicensePlate == licensePlate);
                    if (SelectedCar == null)
                        return null;

                    return new CarModel
                    {
                        CarID = SelectedCar.CarID,
                        CarTypeID = SelectedCar.CarTypeID,
                        CurrentMileage = SelectedCar.CurrentMileage,
                        Image = SelectedCar.Image,
                        IsProper = SelectedCar.IsProper,
                        IsAvailable = SelectedCar.IsAvailable,
                        LicensePlate = SelectedCar.LicensePlate,
                        BranchID = SelectedCar.BranchID
                    };
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return null;
            }
        }

        public static bool UpdateCar(CarModel newCar, int id)
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {

                    Car selectedCar = ef.Cars.FirstOrDefault(dbCar => dbCar.CarID == id);

                    if (selectedCar == null)
                        return false;

                    selectedCar.CarID = newCar.CarID;
                    selectedCar.CarTypeID = newCar.CarTypeID;
                    selectedCar.CurrentMileage = newCar.CurrentMileage;
                    selectedCar.Image = newCar.Image;
                    selectedCar.IsProper = newCar.IsProper;
                    selectedCar.IsAvailable = newCar.IsAvailable;;
                    selectedCar.LicensePlate = newCar.LicensePlate;
                    selectedCar.BranchID = newCar.BranchID;

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

        public static bool DeleteCar(int id)
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    Car SelectedCar = ef.Cars.FirstOrDefault(dbCar => dbCar.CarID == id);
                    if (SelectedCar == null)
                        return false;

                    ef.Cars.Remove(SelectedCar);
                    ef.SaveChanges();
                    return true;
                }
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
