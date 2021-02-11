using _02_BOL;
using _03_BLL;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web.Http;
using System.Web.Http.Cors;

namespace _04_UIL.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/Branch")]
    public class BranchController : ApiController
    {
        // GET: api/Branch
        public HttpResponseMessage Get()
        {
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ObjectContent<BranchModel[]>(BranchesManager.SelectAllBranches(), new JsonMediaTypeFormatter())
            };
        }
    }
}
