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
        private List<Vote> _votes;

        public Feature()
        {
            _votes = new List<Vote>();
        }

        public Feature(string title, string description)
        {
            _title = title;
            _description = description;
            _votes = new List<Vote>();
        }

        public int Id { get; set; }

        /// <summary>
        /// unique identifier of user in the system
        /// </summary>
        public string AuthorId { get; set; }

        /// <summary>
        /// Gets or sets the date and time the feature was created.
        /// </summary>
        public DateTime DateCreated { get; set; }
        /// <summary>
        /// Gets or sets the date and time the feature was last modified.
        /// </summary>
        public DateTime DateModified { get; set; }

        public string Title
        {
            get { return _title; }
            set { _title = value; }
        }
        public string Description
        {
            get { return _description; }
            set { _description = value; }
        }

        public FeatureStatus Status { get; set; }

        public  virtual List<Vote> Votes
        {
            get { return _votes; }
            set { _votes = value; }
        }

    }

}
