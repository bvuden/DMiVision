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
        //public UserInfo UserInfo { get; set; }

        /// <summary>
        /// Collection of feature requests
        /// </summary>
        public IQueryable<FeatureListItem> Features {
            get { return _features.AsQueryable(); }
            set { _features = value.ToList(); }
        }
            

        public void AddFeature(FeatureListItem feature) {
            _features.Add(feature);
        }

    }

}