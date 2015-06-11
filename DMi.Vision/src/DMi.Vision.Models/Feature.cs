using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMi.Vision.Models
{

    public class Feature : IDateTracking
    {

        public Feature()
        {
            Votes = new List<Vote>();
        }

        public Feature(string title, string description)
        {
            Title = title;
            Description = description;
            Votes = new List<Vote>();
        }

        public int Id { get; set; }

        /// <summary>
        /// unique identifier of the author
        /// </summary>
        public string AuthorId { get; set; }

        /// <summary>
        /// unique identifier of the author
        /// </summary>
        public string AuthorName { get; set; }

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

        public FeatureStatus Status { get; set; }

        public virtual List<Vote> Votes { get; set; }


    }

}
