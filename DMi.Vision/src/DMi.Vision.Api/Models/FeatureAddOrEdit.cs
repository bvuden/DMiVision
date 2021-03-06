﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using DMi.Vision.Models;

namespace DMi.Vision.Api.Models
{
    public class FeatureAddOrEdit
    {

        public FeatureAddOrEdit(string title, string description)
        {
            Title = title;
            Description = description;
        }

        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [MinLength(3, ErrorMessage = "Title must be at least 3 characters")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; }

        public string Status { get; set; }
        public bool IsLocked { get; set; }

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
