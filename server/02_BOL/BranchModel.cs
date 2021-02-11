using System.ComponentModel.DataAnnotations;

namespace _02_BOL
{
    public class BranchModel
    {
        public int BranchID { get; set; }

        [Required, MinLength(10), MaxLength(50)]
        public string Address { get; set; }

        [Required]
        public decimal Latitude { get; set; }

        [Required]
        public decimal Longitude { get; set; }

        [Required, MaxLength(15)]
        public string BranchName { get; set; }
    }
}
