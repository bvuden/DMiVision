using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DMi.Vision.Api.Models
{

    public class VoteAddOrEdit
    {
        [Range(1, 100, ErrorMessage = "A minimum of one point is required for a vote")]
        public int Points { get; set; }
        public int Id { get; set; }
    }
}
