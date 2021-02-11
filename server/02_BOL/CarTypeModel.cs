using System.ComponentModel.DataAnnotations;

namespace _02_BOL
{
    public class CarTypeModel
    {
        public int CarTypeID { get; set; }

        [Required, MinLength(2), MaxLength(20)]
        public string ManufacturerName { get; set; }

        [Required, MaxLength(20)]
        public string Model { get; set; }

        [Required, Range(50, 500)]
        public decimal DayCost { get; set; }

        [Required, Range(70, 600)]
        public decimal DayLateCost { get; set; }

        [Required, Range(1990, 2030)]
        public int ManufacturerYear { get; set; }

        [Required]
        public bool Transmission { get; set; }
    }
}
