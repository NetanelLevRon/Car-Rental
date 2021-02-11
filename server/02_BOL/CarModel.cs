using System.ComponentModel.DataAnnotations;

namespace _02_BOL
{
    public class CarModel
    {
        public int CarID { get; set; }

        [Required]
        public int CarTypeID { get; set; }

        [Required, Range(0,999999)]
        public int CurrentMileage { get; set; }

        [Required, MinLength(5)]
        public string Image { get; set; }

        [Required]
        public bool IsProper { get; set; }

        [Required]
        public bool IsAvailable { get; set; }

        [Required, MinLength(7), MaxLength(8)]
        public string LicensePlate { get; set; }

        [Required]
        public int BranchID { get; set; }
    }
}
