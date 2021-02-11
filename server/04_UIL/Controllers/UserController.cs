using _03_BLL;
using _02_BOL;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web.Http;
using System.Web.Http.Cors;
using System;
using System.Linq;
using _04_UIL.Filters;
using System.Security.Claims;

namespace _04_UIL.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/User")]
    public class UserController : ApiController
    {
        // GET: api/User -> get all users
        public HttpResponseMessage Get()
        {
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ObjectContent<UserModel[]>(UsersManager.SelectAllUsers(), new JsonMediaTypeFormatter())
            };            
        }

        [BasicAuthFilter] // get by id -> only 'admin' can access here for edit user (all individual users access with 'GetLogin' after loged in)
        [Authorize(Roles = "admin")] // after authenticate with user name & password
        public HttpResponseMessage Get(int id)
        {
            UserModel user = UsersManager.SelectUser(id);

            if (user != null)
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ObjectContent<UserModel>(user, new JsonMediaTypeFormatter())
                };

            return new HttpResponseMessage(HttpStatusCode.BadRequest);
        }

        // GET: api/User/GetLogin -> after user registered this method been called from client automatically 
        [BasicAuthFilter] // for seting the autorization rols for all next requests from client (see the "BasicAuthFilter" for more understanding)
        [Authorize(Roles = "admin, customer, employee")]
        [Route("GetLogin")]
        [HttpGet]
        public HttpResponseMessage GetLogin()
        {
            var claims = (ClaimsIdentity)User.Identity;
            string userId = claims.FindFirst("userId").Value; // the id is from the current user that registered. stored in claim key "userId"
            int id = Convert.ToInt32(userId);  //convert from string  (see the "BasicAuthFilter" for understanding)

            UserModel user = UsersManager.SelectUser(id);

            if (user != null)
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ObjectContent<UserModel>(user, new JsonMediaTypeFormatter())
                };

            return new HttpResponseMessage(HttpStatusCode.BadRequest);
        }
        
        // POST: api/User -> add user with the registered
        public HttpResponseMessage Post([FromBody]UserModel value)
        {
            bool insertResult = false;

            if (ModelState.IsValid)
            {
                insertResult = UsersManager.InsertUser(value);

                HttpStatusCode responseCode = HttpStatusCode.Created;

                return new HttpResponseMessage(responseCode)
                {
                    Content = new ObjectContent<bool>(insertResult, new JsonMediaTypeFormatter())
                };
            }
            else
            {   // the errors can contain if the ID not right or if the user name not unique
                string[] errArr = ModelState.SelectMany(x => x.Value.Errors).Select(x => x.ErrorMessage).ToArray();
                var response = Request.CreateResponse(HttpStatusCode.BadRequest, errArr);
                return response;

            }


        }

        // PUT: api/User/5 -> onley 'admin' can access for edit
        [BasicAuthFilter] // authenticate with user name & password
        [Authorize(Roles = "admin")]
        public HttpResponseMessage Put(int id, [FromBody]UserModel value)
        {
            bool updateResult = false;

            if (ModelState.IsValid)
            {
                updateResult = UsersManager.UpdateUser(value, id);

                HttpStatusCode responseCode = HttpStatusCode.OK;
                return new HttpResponseMessage(responseCode)
                {
                    Content = new ObjectContent<bool>(updateResult, new JsonMediaTypeFormatter())
                };
            }
            else
            {   // the errors can contain if the ID not right or if the user name not unique
                string[] errArr = ModelState.SelectMany(x => x.Value.Errors).Select(x => x.ErrorMessage).ToArray();
                var response = Request.CreateResponse(HttpStatusCode.BadRequest, errArr);
                return response;
                
            }
        }

        // DELETE: api/User/5 -> onley 'admin' can access for delete
        [BasicAuthFilter] // authenticate with user name & password
        [Authorize(Roles = "admin")]
        public HttpResponseMessage Delete(int id)
        {

            string deleteResult = UsersManager.DeleteUser(id);
            bool deleteResultBool = deleteResult == "ok" ? true : false;
            HttpStatusCode responseCode = deleteResult == "ok"? HttpStatusCode.OK : HttpStatusCode.BadRequest;

            if (deleteResultBool)
            {
                return new HttpResponseMessage(responseCode)
                {
                    Content = new ObjectContent<bool>(deleteResultBool, new JsonMediaTypeFormatter())


                };
            }
            else
            {
                // "The DELETE statement" string appears when delete denayed because this user conected - in db - with orders that he made and the 'userId' within orders table cannot be null
                if (deleteResult.Contains("The DELETE statement")) 
                {
                    deleteResult = "fail to delete because orders exist on this user!";
                }
                var response = Request.CreateResponse(HttpStatusCode.BadRequest, deleteResult);
                return response;

            }


        }
    }
}
