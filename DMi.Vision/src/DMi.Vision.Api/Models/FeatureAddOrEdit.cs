using System;
using System.Collections.Generic;
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
             
        public string Title {
            get { return _title; }
            set { _title = value; }
        }
        public string Description
        {
            get { return _description; }
            set { _description = value; }
        }

    }
}
