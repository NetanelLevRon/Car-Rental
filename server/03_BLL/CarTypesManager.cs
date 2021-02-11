using _01_DAL;
using _02_BOL;
using System;
using System.Linq;

namespace _03_BLL
{
    public class CarTypesManager
    {
        public static CarTypeModel[] SelectAllCarTypes()
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    return ef.CarTypes.Select(dbCarType => new CarTypeModel
                    {
                        CarTypeID = dbCarType.CarTypeID,
                        
                        ManufacturerName = dbCarType.ManufacturerName,
                        Model = dbCarType.model,
                        DayCost = dbCarType.DayCost,
                        DayLateCost = dbCarType.DayLateCost,
                        ManufacturerYear = dbCarType.ManufacturerYear,
                        Transmission = dbCarType.Transmission
                    }).ToArray();
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return null;
            }
        }

        public static CarTypeModel SelectCarType(int id)
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    CarType SelectedCarType = ef.CarTypes.FirstOrDefault(dbCarType => dbCarType.CarTypeID == id);
                    if (SelectedCarType == null)
                        return null;

                    return new CarTypeModel
                    {
                        ManufacturerName = SelectedCarType.ManufacturerName,
                        Model = SelectedCarType.model,
                        DayCost = SelectedCarType.DayCost,
                        DayLateCost = SelectedCarType.DayLateCost,
                        ManufacturerYear = SelectedCarType.ManufacturerYear,
                        Transmission = SelectedCarType.Transmission
                    };
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return null;
            }
        }

        public static bool UpdateCarType(CarTypeModel newCarType, int id)
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    CarType selectedCarType = ef.CarTypes.FirstOrDefault(dbCarType => dbCarType.CarTypeID == id);

                    if (selectedCarType == null)
                        return false;

                    selectedCarType.CarTypeID = newCarType.CarTypeID;
                    selectedCarType.ManufacturerName = newCarType.ManufacturerName;
                    selectedCarType.model = newCarType.Model;
                    selectedCarType.DayCost = newCarType.DayCost;
                    selectedCarType.DayLateCost = newCarType.DayLateCost;
                    selectedCarType.ManufacturerYear = newCarType.ManufacturerYear;
                    selectedCarType.Transmission = newCarType.Transmission;

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

        public static bool DeleteCarType(int id)
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    CarType SelectedCarType = ef.CarTypes.FirstOrDefault(dbCarType => dbCarType.CarTypeID == id);
                    if (SelectedCarType == null)
                        return false;

                    ef.CarTypes.Remove(SelectedCarType);
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
    }
}
