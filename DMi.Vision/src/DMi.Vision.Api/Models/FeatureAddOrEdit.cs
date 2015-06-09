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


        public string AuthorId { get; set; }
        public string AuthorName { get; set; }

        /// <summary>
        /// Total amount of vote points added to the feature request
        /// </summary>
        public int TotalGivenVotePoints { get; set; }

        /// <summary>
        /// vote given by the current user
        /// </summary>
        public VoteAddOrEdit UserGivenVote { get; set; }


    }
}
