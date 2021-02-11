using System;
using System.ComponentModel.DataAnnotations;

namespace _02_BOL
{
    public class OrderModel
    {
        public int OrderID { get; set; }

        [Required, DisplayFormat(DataFormatString = "{0:MMM dd, yyyy}")]
        public DateTime RentalStart { get; set; }

        [Required, DisplayFormat(DataFormatString = "{0:MMM dd, yyyy}")]
        public DateTime RentalEnd { get; set; }

        [DisplayFormat(DataFormatString = "{0:MMM dd, yyyy}")]
        public Nullable<DateTime> ActualRentalEnd { get; set; }

        [Required]
        public int UserID { get; set; }

        [Required]
        public int CarID { get; set; }
    }
}
