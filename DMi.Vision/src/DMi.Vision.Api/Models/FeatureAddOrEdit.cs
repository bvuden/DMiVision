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

        [Required(ErrorMessage="Feature title is required")]
        [MinLength(3,ErrorMessage ="Feature title must be at least 3 characters")]
        public string Title {
            get { return _title; }
            set { _title = value; }
        }

        [Required(ErrorMessage = "Feature description is required")]
        public string Description
        {
            get { return _description; }
            set { _description = value; }
        }

    }
}
