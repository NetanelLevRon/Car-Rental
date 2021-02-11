using _02_BOL;
using _03_BLL;
using System.Net.Http.Formatting;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using _04_UIL.Filters;

namespace _04_UIL.Controllers
{
   
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/Order")]
    public class OrderController : ApiController
    {
        // GET: api/Order
        public HttpResponseMessage Get()
        {
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ObjectContent<OrderModel[]>(OrdersManager.SelectAllOrders(), new JsonMediaTypeFormatter())
            };
        }

        // GET: api/Order/5
        [BasicAuthFilter] // get by id for edit every individual order.
        [Authorize(Roles = "admin")] //  after authenticate as 'admin' (the only role that get the order for edit by id)
        public HttpResponseMessage Get(int id)
        {
            OrderModel order = OrdersManager.SelectOrder(id);

            if (order != null)
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ObjectContent<OrderModel>(order, new JsonMediaTypeFormatter())
                };

            return new HttpResponseMessage(HttpStatusCode.BadRequest);
        }

        // GET: api/Order/GetOrderByCarId/5
        [BasicAuthFilter] // get order by car id (after the 'employee' get the car with 'licens-plate' this method been called (from client end) with the 'carId' of the car) for set the 'actual-rental-end'
        [Authorize(Roles = "employee")] 
        [Route("GetOrderByCarId/carId/{carId}")]
        [HttpGet]
        public HttpResponseMessage GetOrderByCarId(int carId)
        {
            OrderModel order = OrdersManager.SelectOpenOrderToClose(carId);

            if (order != null)
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ObjectContent<OrderModel>(order, new JsonMediaTypeFormatter())
                };

            return new HttpResponseMessage(HttpStatusCode.BadRequest);
        }

        // GET: api/Order/GetUserOrders/5
        [BasicAuthFilter] // get all the orders that this 'customer' made by his user-id
        [Authorize(Roles = "customer")]
        [Route("GetUserOrders/userId/{userId}")]
        [HttpGet]
        public HttpResponseMessage GetUserOrders(int userId)
        {
            OrderModel[] openOrder = OrdersManager.SelectUserOrders(userId);

            if (openOrder != null)
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ObjectContent<OrderModel[]>(openOrder, new JsonMediaTypeFormatter())
                };

            return new HttpResponseMessage(HttpStatusCode.BadRequest);
        }

        // POST: api/Order
        [BasicAuthFilter] 
        [Authorize(Roles = "customer")] // only 'custome' can add order
        public HttpResponseMessage Post([FromBody]OrderModel value)
        {
            bool insertResult = false;

            if (ModelState.IsValid)
                insertResult = OrdersManager.InsertOrder(value);

            HttpStatusCode responseCode = insertResult ? HttpStatusCode.Created : HttpStatusCode.BadRequest;

            return new HttpResponseMessage(responseCode)
            {
                Content = new ObjectContent<bool>(insertResult, new JsonMediaTypeFormatter())
            };
        }

        // PUT: api/Order/5
        [BasicAuthFilter]
        [Authorize(Roles = "admin, employee")]
        public HttpResponseMessage Put(int id, [FromBody]OrderModel value)
        {
            bool updateResult = false;

            if (ModelState.IsValid)
                updateResult = OrdersManager.UpdateOrder(value, id);

            HttpStatusCode responseCode = updateResult ? HttpStatusCode.OK : HttpStatusCode.BadRequest;

            return new HttpResponseMessage(responseCode)
            {
                Content = new ObjectContent<bool>(updateResult, new JsonMediaTypeFormatter())
            };
        }

        // DELETE: api/Order/5
        [BasicAuthFilter] // only 'admin' can delete order
        [Authorize(Roles = "admin")]
        public HttpResponseMessage Delete(int id)
        {
            bool deleteResulte = OrdersManager.DeleteOrder(id);

            HttpStatusCode responseCode = deleteResulte ? HttpStatusCode.OK : HttpStatusCode.BadRequest;

            return new HttpResponseMessage(responseCode)
            {
                Content = new ObjectContent<bool>(deleteResulte, new JsonMediaTypeFormatter())
            };
        }
    }
}