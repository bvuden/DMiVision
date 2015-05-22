using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMi.Vision.Models
{
    public class Vote
    {
        public int Id { get; set; }
        /// <summary>
        /// unique identifier of user in the system
        /// </summary>
        public string VoterId { get; set; }
        public int Points { get; set; }
    }
}
