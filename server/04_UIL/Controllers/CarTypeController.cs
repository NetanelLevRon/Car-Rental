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
    [RoutePrefix("api/CarType")]
    public class CarTypeController : ApiController
    {
        // GET: api/CarType
        public HttpResponseMessage Get()
        {
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ObjectContent<CarTypeModel[]>(CarTypesManager.SelectAllCarTypes(), new JsonMediaTypeFormatter())
            };
        }

        // GET: api/CarType/5
        [BasicAuthFilter]
        [Authorize(Roles = "admin, employee")] // 'employee' for calculate the rental final cost and 'admin' get it for generally editing 
        public HttpResponseMessage Get(int id)
        {
            CarTypeModel CarType = CarTypesManager.SelectCarType(id);

            if (CarType != null)
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ObjectContent<CarTypeModel>(CarType, new JsonMediaTypeFormatter())
                };

            return new HttpResponseMessage(HttpStatusCode.BadRequest);
        }

        // PUT: api/CarType/5 -> edit 'car type' by id
        [BasicAuthFilter] 
        [Authorize(Roles = "admin")] // the only role that can edit car-type
        public HttpResponseMessage Put(int id, [FromBody]CarTypeModel value)
        {
            bool updateResult = false;

            if (ModelState.IsValid)
                updateResult = CarTypesManager.UpdateCarType(value, id);

            HttpStatusCode responseCode = updateResult ? HttpStatusCode.OK : HttpStatusCode.BadRequest;

            return new HttpResponseMessage(responseCode)
            {
                Content = new ObjectContent<bool>(updateResult, new JsonMediaTypeFormatter())
            };
        }

        // DELETE: api/CarType/5
        [BasicAuthFilter]
        [Authorize(Roles = "admin")]
        public HttpResponseMessage Delete(int id)
        {
            bool deleteResulte = CarTypesManager.DeleteCarType(id);

            HttpStatusCode responseCode = deleteResulte ? HttpStatusCode.OK : HttpStatusCode.BadRequest;

            return new HttpResponseMessage(responseCode)
            {
                Content = new ObjectContent<bool>(deleteResulte, new JsonMediaTypeFormatter())
            };
        }
    }
}