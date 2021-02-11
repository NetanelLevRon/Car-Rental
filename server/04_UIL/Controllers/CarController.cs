using _02_BOL;
using _03_BLL;
using _04_UIL.Filters;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web.Http;
using System.Web.Http.Cors;

namespace _04_UIL.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/Car")]
    public class CarController : ApiController
    {
        // GET: api/Car
        public HttpResponseMessage Get()
        {
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ObjectContent<CarModel[]>(CarsManager.SelectAllCars(), new JsonMediaTypeFormatter())
            };
        }

        // GET: api/Car/5 
        [BasicAuthFilter]
        [Authorize(Roles = "admin, customer")] // 'customer' get the car for update avilability and 'admin' for generally editing
        public HttpResponseMessage Get(int id)
        {
            CarModel Car = CarsManager.SelectCar(id);

            if (Car != null)
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ObjectContent<CarModel>(Car, new JsonMediaTypeFormatter())
                };

            return new HttpResponseMessage(HttpStatusCode.BadRequest);
        }

        // GET: api/Car/GetByLicense/licensePlate/5555555
        [BasicAuthFilter]
        [Authorize(Roles = "employee")] // 'employee' get this car after typing the 'license-plate' number, for update the 'actual-rental-end' later
        [Route("GetByLicense/licensePlate/{licensePlate}")]
        [HttpGet]
        public HttpResponseMessage GetByLicense(string licensePlate)
        {
            CarModel Car = CarsManager.SelectCarByLicensePlate(licensePlate);

            if (Car != null)
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ObjectContent<CarModel>(Car, new JsonMediaTypeFormatter())

                };
 
             return new HttpResponseMessage(HttpStatusCode.BadRequest);

        }

        // PUT: api/Car/5 -> not demand authentication becuase it used for update car avilability automatocally (with not authenticate user)
        public HttpResponseMessage Put(int id, [FromBody]CarModel value)
        {
            bool updateResult = false;

            if (ModelState.IsValid)
                updateResult = CarsManager.UpdateCar(value, id);

            HttpStatusCode responseCode = updateResult ? HttpStatusCode.OK : HttpStatusCode.BadRequest;

            return new HttpResponseMessage(responseCode)
            {
                Content = new ObjectContent<bool>(updateResult, new JsonMediaTypeFormatter())
            };
        }

        // DELETE: api/Car/5
        [BasicAuthFilter]
        [Authorize(Roles = "admin")]
        public HttpResponseMessage Delete(int id)
        {
            bool deleteResulte = CarsManager.DeleteCar(id);

            HttpStatusCode responseCode = deleteResulte ? HttpStatusCode.OK : HttpStatusCode.BadRequest;

            return new HttpResponseMessage(responseCode)
            {
                Content = new ObjectContent<bool>(deleteResulte, new JsonMediaTypeFormatter())
            };
        }
    }
}