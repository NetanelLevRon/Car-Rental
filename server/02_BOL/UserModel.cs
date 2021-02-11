using System;
using System.ComponentModel.DataAnnotations;

namespace _02_BOL
{
    [IsUniqueValidator] // the attribute is for the 'UserName' and the reason it operate on all the model is for requests from 'admin' when edit. (for more details and explanation see inside the "IsUniqueValidator.cs" file) 
    public class UserModel
    {
        public int UserID { get; set; }

        [Required, MinLength(5), MaxLength(30)]
        public string FullName { get; set; }

        [Required, IdValidator]
        public string ID { get; set; }

        [Required, MinLength(2), MaxLength(30)]
        public string UserName { get; set; }

        public Nullable<DateTime> BirthDate { get; set; }

        [Required]
        public bool Gender { get; set; }

        [DataType(DataType.EmailAddress),Required]
        public string Email { get; set; }

        [Required, MinLength(4), MaxLength(8)]
        public string Password { get; set; }

        [MinLength(5), MaxLength(8)]
        public string UserRole { get; set; }
        
        public string Image { get; set; }

    }
}
