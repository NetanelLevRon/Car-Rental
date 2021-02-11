using _02_BOL;
using System.Net.Mail;
using System.Web.Http;
using System.Net;
using System;
using System.Net.Http;
using System.Web.Http.Cors;

namespace _04_UIL.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/email")]
    public class EmailController : ApiController
    {
        [HttpPost]
        [Route("send-email")]
        public HttpResponseMessage SendEmail([FromBody]EmailModel value)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    MailMessage message = new MailMessage(value.senderMail, value.tomail, value.subject, value.message);
                    message.IsBodyHtml = true;
                    message.Body += "<br/><br/>been send behalf of: " + value.senderMail;
                    SmtpClient client = new SmtpClient("smtp.gmail.com", 587);
                    client.UseDefaultCredentials = false;
                    client.Credentials = new NetworkCredential("yourEmail@gmail.com", "your password"); // the sender email address & sender password
                    client.EnableSsl = true; // to encrypt the connection
                    client.Send(message);

                    return new HttpResponseMessage(HttpStatusCode.OK);


                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    var response = Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
                    return response;
                }
            }
            else
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }


            
        }
        
    }
}