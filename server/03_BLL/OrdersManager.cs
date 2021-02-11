using _01_DAL;
using _02_BOL;
using System;
using System.Linq;

namespace _03_BLL
{
    public class OrdersManager
    {
        public static bool InsertOrder(OrderModel newOrder)
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    ef.Orders.Add(new Order
                    {
                        RentalStart = newOrder.RentalStart,
                        RentalEnd = newOrder.RentalEnd,
                        ActualRentalEnd = null,
                        UserID = newOrder.UserID,
                        CarID = newOrder.CarID
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

        public static OrderModel[] SelectAllOrders()
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    return ef.Orders.Select(dbOrder => new OrderModel 
                    {
                        OrderID = dbOrder.OrderID,
                        RentalStart = dbOrder.RentalStart,
                        RentalEnd = dbOrder.RentalEnd,
                        ActualRentalEnd = (DateTime)dbOrder.ActualRentalEnd,
                        UserID = dbOrder.UserID,
                        CarID = dbOrder.CarID
                    }).ToArray();
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return null;
            }
        }

        public static OrderModel SelectOrder(int id)
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    Order SelectedOrder = ef.Orders.FirstOrDefault(dbOrder => dbOrder.OrderID == id);
                    if (SelectedOrder == null)
                        return null;

                    return new OrderModel
                    {
                        OrderID = SelectedOrder.OrderID,
                        RentalStart = SelectedOrder.RentalStart,
                        RentalEnd = SelectedOrder.RentalEnd,
                        ActualRentalEnd = SelectedOrder.ActualRentalEnd != null? (DateTime)SelectedOrder.ActualRentalEnd: SelectedOrder.ActualRentalEnd,
                        UserID = SelectedOrder.UserID,
                        CarID = SelectedOrder.CarID
                    };
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return null;
            }
        }

        public static OrderModel SelectOpenOrderToClose(int carId)
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    Order SelectedOrder = ef.Orders.FirstOrDefault(dbOrder => 
                    dbOrder.CarID == carId && dbOrder.ActualRentalEnd == null);
                    if (SelectedOrder == null)
                        return null;

                    return new OrderModel
                    {
                        OrderID = SelectedOrder.OrderID,
                        RentalStart = SelectedOrder.RentalStart,
                        RentalEnd = SelectedOrder.RentalEnd,
                        ActualRentalEnd = null, // part of the condition
                        UserID = SelectedOrder.UserID,
                        CarID = SelectedOrder.CarID
                    };
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return null;
            }
        }

        public static OrderModel[] SelectUserOrders(int userId)
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                  
                    return ef.Orders.Select(dbOrder => new OrderModel
                    {
                        OrderID = dbOrder.OrderID,
                        RentalStart = dbOrder.RentalStart,
                        RentalEnd = dbOrder.RentalEnd,
                        ActualRentalEnd = (DateTime)dbOrder.ActualRentalEnd,
                        UserID = dbOrder.UserID,
                        CarID = dbOrder.CarID
                    }).Where((singleOrdr) => singleOrdr.UserID == userId)
                    .ToArray();
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return null;
            }
        }

        public static bool UpdateOrder(OrderModel newOrder, int id)
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    Order selectedOrder = ef.Orders.FirstOrDefault(dbOrder => dbOrder.OrderID == id);
                    Car selectedCar = ef.Cars.FirstOrDefault(dbCar => dbCar.CarID == newOrder.CarID);

                    if (selectedOrder == null||selectedCar==null)
                        return false;


                    selectedOrder.RentalStart = newOrder.RentalStart;
                    selectedOrder.RentalEnd = newOrder.RentalEnd;
                    selectedOrder.ActualRentalEnd = newOrder.ActualRentalEnd;
                    selectedOrder.UserID = newOrder.UserID;
                    selectedOrder.CarID = newOrder.CarID;

                    if (newOrder.ActualRentalEnd <= DateTime.Now)
                    {
                        selectedCar.IsAvailable = true;
                    }

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

        public static bool DeleteOrder(int id)
        {
            try
            {
                using (CarRentalEntities ef = new CarRentalEntities())
                {
                    Order SelectedOrder = ef.Orders.FirstOrDefault(dbOrder => dbOrder.OrderID == id);
                    if (SelectedOrder == null)
                        return false;

                    ef.Orders.Remove(SelectedOrder);
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
