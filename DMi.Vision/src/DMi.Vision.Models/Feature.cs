using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DMi.Infrastructure;

namespace DMi.Vision.Models
{
    
    public class Feature : DomainEntity<int>, IDateTracking
    {
        private string _title;
        private string _description; 

        public Feature(string title, string description)
        {
            _title = title;
            _description = description;
        }

        /// <summary>
        /// Gets or sets the date and time the feature was created.
        /// </summary>
        public DateTime DateCreated { get; set; }
        /// <summary>
        /// Gets or sets the date and time the feature was last modified.
        /// </summary>
        public DateTime DateModified { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public int Points { get; set; }
    }

    

}
