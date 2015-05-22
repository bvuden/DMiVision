using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMi.Vision.Models
{
    
    public class Feature : IDateTracking
    {
        private string _title;
        private string _description;

        public Feature()
        {

        }

        public Feature(string title, string description)
        {
            _title = title;
            _description = description;
        }

        public int Id { get; set; }

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
