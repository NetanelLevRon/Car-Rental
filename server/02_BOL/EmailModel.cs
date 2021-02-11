using System.ComponentModel.DataAnnotations;

namespace _02_BOL
{
    public class EmailModel
    {
        [Required, EmailAddress]
        public string senderMail { get; set; } // from = the sender mail
        [Required, EmailAddress]
        public string tomail { get; set; } // to = the recipient mail
        [Required]
        public string subject { get; set; }
        [Required]
        public string message { get; set; }
    }
}
