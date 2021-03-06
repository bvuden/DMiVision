﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMi.Vision.Api.Models
{
    public class FeatureListItem
    {

        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string Status { get; set; }
        public bool IsLocked { get; set; }

        /// <summary>
        /// unique identifier of user in the system
        /// </summary>
        public string AuthorId { get; set; }

        public string AuthorName { get; set; }

        /// <summary>
        /// Total amount of vote points added to the feature request
        /// </summary>
        public int TotalGivenVotePoints { get; set; }


        /// <summary>
        /// Amount of vote points given to this feature by the currently logged in user
        /// </summary>
        public int UserGivenVotePoints { get; set; }
    }

}