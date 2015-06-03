using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DMi.Vision.Api.Models
{
    public class FeatureAddOrEdit
    {
        private string _title;
        private string _description;

        public FeatureAddOrEdit(string title, string description)
        {
            _title = title;
            _description = description;
        }

        public int Id { get; set; }

        [Required(ErrorMessage="Title is required")]
        [MinLength(3,ErrorMessage ="Title must be at least 3 characters")]
        public string Title {
            get { return _title; }
            set { _title = value; }
        }

        [Required(ErrorMessage = "Description is required")]
        public string Description
        {
            get { return _description; }
            set { _description = value; }
        }



        /// <summary>
        /// Amount of vote points the user has added to this feature request
        /// </summary>
        [Required(ErrorMessage = "A vote is required")]
        [Range(1,100,ErrorMessage ="Give at least one point to your feature request")]
        public int UserGivenVotePoints { get; set; }

        /// <summary>
        /// Amount of vote points available to the currently logged in user
        /// </summary>
        public int UserAvailableVotePoints { get; set; }

        /// <summary>
        /// Total amount of vote points added to the feature request
        /// </summary>
        public int TotalGivenVotePoints { get; set; }

    }
}
