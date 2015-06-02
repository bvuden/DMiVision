using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMi.Vision.Api.Models
{
    public class FeatureList
    {

        private List<FeatureListItem> _features;

        public FeatureList()
        {
            _features = new List<FeatureListItem>();
        }
        /// <summary>
        /// Amount of vote points available to the currently logged in user
        /// </summary>
        public int UserAvailableVotePoints { get; set; }

        /// <summary>
        /// Collection of feature requests
        /// </summary>
        public List<FeatureListItem> Features
        {
            get { return _features; }
            set { _features = value; }
        }

    }

}