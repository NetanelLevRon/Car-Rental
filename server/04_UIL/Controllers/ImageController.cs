using System;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace _03_UIL.Controllers
{

    public class ImageController : ApiController
    {
        [HttpPost]
        [Route("api/UploadImage")]
        [EnableCors("*", "*", "*")]
        public IHttpActionResult UploadImage()
        {
            string imageName = null;
            var httpRequest = HttpContext.Current.Request;

            //Get Image caption
            string imageCaption = httpRequest.Form["ImageCaption"];

            //Upload Image
            var postedFile = httpRequest.Files["Image"];
            //Create custom filename
            imageName = new String(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(10).ToArray()).Replace(" ", "-");
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(postedFile.FileName);
            var filePath = HttpContext.Current.Server.MapPath("~/Image/" + imageName);
            postedFile.SaveAs(filePath);

            return Ok(imageName);
        }
    }
}
